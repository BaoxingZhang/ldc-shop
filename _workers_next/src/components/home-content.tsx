'use client'

import { useState, useMemo } from "react"
import { useI18n } from "@/lib/i18n/context"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StarRating } from "@/components/star-rating"
import ReactMarkdown from 'react-markdown'
import { cn } from "@/lib/utils"

interface Product {
    id: string
    name: string
    description: string | null
    price: string
    compareAtPrice?: string | null
    image: string | null
    category: string | null
    stockCount: number
    soldCount: number
    isHot?: boolean | null
    rating?: number
    reviewCount?: number
}

interface HomeContentProps {
    products: Product[]
    announcement?: string | null
    visitorCount?: number
    categories?: Array<{ name: string; icon: string | null; sortOrder: number }>
    pendingOrders?: Array<{ orderId: string; createdAt: Date; productName: string; amount: string }>
}

export function HomeContent({ products, announcement, visitorCount, categories: categoryConfig, pendingOrders }: HomeContentProps) {
    const { t } = useI18n()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortKey, setSortKey] = useState<string>("default")

    // Extract unique categories
    const categories = useMemo(() => {
        const productCategories = new Set(products.map(p => p.category).filter(Boolean) as string[])
        const configCategories = categoryConfig || []

        // Start with configured categories to preserve their order
        const orderedNames = configCategories
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .map(c => c.name)

        // Add any product categories that aren't in the config
        const extraCategories = Array.from(productCategories)
            .filter(c => !configCategories.some(config => config.name === c))
            .sort()

        return [...orderedNames, ...extraCategories]
    }, [categoryConfig, products])

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = products

        // Category filter
        if (selectedCategory) {
            result = result.filter(p => p.category === selectedCategory)
        }

        // Search filter
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase()
            result = result.filter(p =>
                p.name.toLowerCase().includes(lowerTerm) ||
                (p.description && p.description.toLowerCase().includes(lowerTerm))
            )
        }

        const sorted = [...result]
        switch (sortKey) {
            case 'priceAsc':
                sorted.sort((a, b) => Number(a.price) - Number(b.price))
                break
            case 'priceDesc':
                sorted.sort((a, b) => Number(b.price) - Number(a.price))
                break
            case 'stockDesc':
                sorted.sort((a, b) => (b.stockCount || 0) - (a.stockCount || 0))
                break
            case 'soldDesc':
                sorted.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
                break
            default:
                break
        }

        return sorted
    }, [products, selectedCategory, searchTerm, sortKey])

    return (
        <main className="container py-8 md:py-16">

            {/* Announcement Banner */}
            {announcement && (
                <section className="mb-8">
                    <div className="relative overflow-hidden border-4 border-border bg-secondary p-4 neo-shadow-md">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                        <div className="flex items-start gap-3 pl-4">
                            <svg className="w-6 h-6 text-foreground shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                            <p className="text-sm text-foreground font-bold leading-relaxed whitespace-pre-wrap uppercase">{announcement}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Pending Orders Notification */}
            {pendingOrders && pendingOrders.length > 0 && (
                <section className="mb-8">
                    <div className="relative overflow-hidden border-4 border-border bg-muted p-4 neo-shadow-sm">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                        <div className="flex items-center justify-between gap-4 pl-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-bold text-foreground uppercase">
                                    {pendingOrders.length === 1
                                        ? t('home.pendingOrder.single', { orderId: pendingOrders[0].orderId })
                                        : t('home.pendingOrder.multiple', { count: pendingOrders.length })
                                    }
                                </p>
                            </div>
                            <Link href={pendingOrders.length === 1 ? `/order/${pendingOrders[0].orderId}` : '/orders'}>
                                <Button size="sm" className="neo-btn bg-primary text-foreground hover:bg-secondary cursor-pointer">
                                    {pendingOrders.length === 1 ? t('common.payNow') : t('common.viewOrders')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Header Area with Visitor Count and Controls */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-center justify-between">
                    {typeof visitorCount === 'number' && (
                        <Badge variant="secondary" className="px-4 py-2 neo-badge bg-secondary text-foreground">
                            {t('home.visitorCount', { count: visitorCount })}
                        </Badge>
                    )}
                </div>

                {/* Top Toolbar: Search & Filter Pills */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card border-4 border-border p-4 neo-shadow-sm">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-72 shrink-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <Input
                            placeholder={t('common.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full neo-input"
                        />
                    </div>

                    {/* Horizontal Category Pills */}
                    <div className="flex-1 w-full overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        <div className="flex gap-2">
                            <Button
                                variant={selectedCategory === null ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "whitespace-nowrap transition-all duration-100 neo-btn",
                                    selectedCategory === null ? "bg-primary" : "bg-card hover:bg-secondary"
                                )}
                                onClick={() => setSelectedCategory(null)}
                            >
                                {t('common.all')}
                            </Button>
                            {categories.map(category => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    className={cn(
                                        "capitalize whitespace-nowrap transition-all duration-100 neo-btn",
                                        selectedCategory === category ? "bg-primary" : "bg-card hover:bg-secondary"
                                    )}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {categoryConfig?.length
                                        ? `${categoryConfig.find(c => c.name === category)?.icon ? `${categoryConfig.find(c => c.name === category)?.icon} ` : ''}${category}`
                                        : category}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Dropdown (Simplified as inline buttons for now, or dropdown later) */}
                    <div className="shrink-0 flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        <span className="text-xs text-foreground font-bold whitespace-nowrap hidden md:inline-block mr-1 uppercase">{t('home.sort.title')}:</span>
                        {[
                            { key: 'default', label: t('home.sort.default'), icon: null },
                            { key: 'stockDesc', label: t('home.sort.stock'), icon: '📦' },
                            { key: 'priceAsc', label: 'Price ↑', icon: '💰' },
                            { key: 'priceDesc', label: 'Price ↓', icon: '💰' },
                        ].map(opt => (
                            <Button
                                key={opt.key}
                                type="button"
                                variant={sortKey === opt.key ? "secondary" : "ghost"}
                                size="sm"
                                className={cn(
                                    "h-8 px-3 text-xs whitespace-nowrap font-bold uppercase border-2 border-border",
                                    sortKey === opt.key ? "bg-secondary text-foreground" : "bg-card text-foreground hover:bg-muted"
                                )}
                                onClick={() => setSortKey(opt.key)}
                            >
                                {opt.key === 'priceAsc' ? t('home.sort.priceAsc') :
                                    opt.key === 'priceDesc' ? t('home.sort.priceDesc') :
                                        opt.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Product Grid (Full Width) */}
            <section>
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-card border-4 border-border neo-shadow-md">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary border-4 border-border mb-4">
                            <svg className="w-10 h-10 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <p className="text-foreground font-bold uppercase text-lg">{t('home.noProducts')}</p>
                        <p className="text-sm text-foreground mt-2 uppercase">{t('home.checkBackLater')}</p>
                        {selectedCategory && (
                            <Button variant="link" onClick={() => setSelectedCategory(null)} className="mt-4 neo-btn bg-primary text-foreground">
                                {t('common.all')}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {filteredProducts.map((product, index) => (
                            <Card
                                key={product.id}
                                className="group overflow-hidden flex flex-col neo-card animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Image Section with aspect ratio tweak */}
                                <Link href={`/buy/${product.id}`} className="block aspect-[16/10] bg-muted relative overflow-hidden border-b-4 border-border">
                                    <img
                                        src={product.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`}
                                        alt={product.name}
                                        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                                    />
                                    {product.category && product.category !== 'general' && (
                                        <Badge className="absolute top-3 right-3 text-xs px-3 py-1 capitalize neo-badge bg-secondary text-foreground">
                                            {product.category}
                                        </Badge>
                                    )}
                                </Link>

                                {/* Content Section */}
                                <CardContent className="flex-1 p-4">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <Link href={`/buy/${product.id}`} className="block">
                                            <h3 className="font-bold text-base text-foreground uppercase group-hover:text-primary transition-colors duration-200 leading-snug line-clamp-1" title={product.name}>
                                                {product.name}
                                            </h3>
                                        </Link>
                                    </div>

                                    {product.isHot && (
                                        <div className="mb-2">
                                            <Badge variant="default" className="text-xs px-2 py-1 neo-badge bg-primary text-foreground">
                                                🔥 {t('buy.hot')}
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Rating */}
                                    {product.reviewCount !== undefined && product.reviewCount > 0 && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <StarRating rating={Math.round(product.rating || 0)} size="xs" />
                                            <span className="text-xs text-foreground font-bold">({product.reviewCount})</span>
                                        </div>
                                    )}

                                    <div className="text-foreground text-xs line-clamp-2 h-8 leading-4 overflow-hidden font-medium">
                                        <ReactMarkdown
                                            allowedElements={["text", "span"]}
                                            unwrapDisallowed={true}
                                        >
                                            {product.description || t('buy.noDescription')}
                                        </ReactMarkdown>
                                    </div>
                                </CardContent>

                                {/* Footer Section */}
                                <CardFooter className="p-4 pt-0 flex items-center justify-between gap-3 mt-auto border-t-4 border-border bg-secondary">
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xl font-black text-foreground">{Number(product.price)}</span>
                                            <span className="text-xs text-foreground font-bold uppercase">{t('common.credits')}</span>
                                        </div>
                                        {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                                            <span className="text-xs text-foreground line-through -mt-1 block">
                                                {Number(product.compareAtPrice)}
                                            </span>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-foreground font-bold">
                                                {t('common.stock')}: {product.stockCount}
                                            </span>
                                            <span className="text-xs text-foreground font-bold">
                                                {t('common.sold')}: {product.soldCount}
                                            </span>
                                        </div>
                                    </div>

                                    <Link href={`/buy/${product.id}`}>
                                        <Button
                                            size="sm"
                                            className={cn(
                                                "h-10 px-5 text-xs font-bold uppercase neo-btn cursor-pointer",
                                                product.stockCount > 0 ? "bg-primary text-foreground hover:bg-muted" : "bg-muted text-foreground"
                                            )}
                                            disabled={product.stockCount <= 0}
                                        >
                                            {product.stockCount > 0 ? t('common.buy') : t('common.outOfStock')}
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
