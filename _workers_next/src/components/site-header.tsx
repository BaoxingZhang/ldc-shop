import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { SignInButton } from "@/components/signin-button"
import { SignOutButton } from "@/components/signout-button"
import { HeaderLogo, HeaderNav, HeaderSearch, HeaderUserMenuItems, HeaderUnreadBadge, LanguageSwitcher } from "@/components/header-client-parts"
import { ModeToggle } from "@/components/mode-toggle"
import { getSetting, recordLoginUser, setSetting, getUserUnreadNotificationCount } from "@/lib/db/queries"
import { CheckInButton } from "@/components/checkin-button"

export async function SiteHeader() {
    const session = await auth()
    const user = session?.user
    if (user?.id) {
        await recordLoginUser(user.id, user.username || user.name || null, user.email || null)
    }

    // Check if admin (case-insensitive)
    const rawAdminUsers = process.env.ADMIN_USERS?.split(',') || []
    const adminUsers = rawAdminUsers.map(u => u.toLowerCase())
    const isAdmin = user?.username && adminUsers.includes(user.username.toLowerCase()) || false
    const firstAdminName = rawAdminUsers[0]?.trim() // Get first admin name for branding
    let shopNameOverride: string | null = null
    let shopLogoOverride: string | null = null
    try {
        const [name, logo] = await Promise.all([
            getSetting('shop_name'),
            getSetting('shop_logo')
        ])
        shopNameOverride = name
        shopLogoOverride = logo
    } catch {
        shopNameOverride = null
        shopLogoOverride = null
    }
    if (isAdmin && user?.avatar_url && (!shopLogoOverride || !shopLogoOverride.trim())) {
        try {
            await setSetting('shop_logo', user.avatar_url)
            await setSetting('shop_logo_updated_at', String(Date.now()))
            shopLogoOverride = user.avatar_url
        } catch {
            // best effort
        }
    }

    let checkinEnabled = true
    try {
        const v = await getSetting('checkin_enabled')
        checkinEnabled = v !== 'false'
    } catch {
        checkinEnabled = true
    }

    let unreadCount = 0
    if (user?.id) {
        try {
            unreadCount = await getUserUnreadNotificationCount(user.id)
        } catch {
            unreadCount = 0
        }
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b-4 border-black dark:border-white bg-background">
            <div className="container flex h-16 items-center gap-2 md:gap-4">
                <div className="flex items-center gap-4 md:gap-8 min-w-0">
                    <HeaderLogo adminName={firstAdminName} shopNameOverride={shopNameOverride} shopLogoOverride={shopLogoOverride} />
                    <HeaderNav isAdmin={isAdmin} isLoggedIn={!!user} />
                </div>
                <div className="hidden md:flex flex-1 justify-center px-4">
                    {/* HeaderSearch removed as per user request */}
                </div>
                <div className="ml-auto flex items-center justify-end gap-2 md:gap-3">
                    <nav className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ModeToggle />
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="relative h-12 w-12 overflow-visible p-0">
                                        <HeaderUnreadBadge initialCount={unreadCount} className="absolute -top-2 -right-2 z-10 pointer-events-none" />
                                        <Avatar className="relative z-0 h-10 w-10 border-2 border-black dark:border-white">
                                            <AvatarImage src={user.avatar_url || ''} alt={user.name || ''} />
                                            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFFDF5]" align="end" forceMount>
                                    <DropdownMenuLabel className="font-bold">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-black leading-none uppercase">{user.name}</p>
                                            <p className="text-xs leading-none text-foreground/60 font-bold">ID: {user.id}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-black dark:bg-white h-0.5" />
                                    <div className="px-2 py-1">
                                        <CheckInButton enabled={checkinEnabled} />
                                    </div>
                                    <DropdownMenuSeparator className="bg-black dark:bg-white h-0.5" />
                                    <HeaderUserMenuItems isAdmin={isAdmin} />
                                    <DropdownMenuSeparator className="bg-black dark:bg-white h-0.5" />
                                    <SignOutButton />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <SignInButton />
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
