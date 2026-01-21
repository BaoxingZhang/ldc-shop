import { getServerI18n } from "@/lib/i18n/server"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { StarRatingStatic } from "@/components/star-rating-static"

interface Product {
    id: string
    name: string
    description: string | null
    descriptionPlain?: string | null
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
    categories?: string[]
    categoryConfig?: Array<{ name: string; icon: string | null; sortOrder: number }>
    pendingOrders?: Array<{ orderId: string; createdAt: Date; productName: string; amount: string }>
    filters: { q?: string; category?: string | null; sort?: string }
    pagination: { page: number; pageSize: number; total: number }
}

export async function HomeContent({ products, announcement, visitorCount, categories = [], categoryConfig, pendingOrders, filters, pagination }: HomeContentProps) {
    const { t } = await getServerI18n()
    const selectedCategory = filters.category || null
    const searchTerm = filters.q || ""
    const sortKey = filters.sort || "default"

    const buildUrl = (next: { q?: string; category?: string | null; sort?: string; page?: number }) => {
        const params = new URLSearchParams()
        if (next.q) params.set('q', next.q)
        if (next.category) params.set('category', next.category)
        if (next.sort && next.sort !== 'default') params.set('sort', next.sort)
        if (next.page && next.page > 1) params.set('page', String(next.page))
        const qs = params.toString()
        return qs ? `/?${qs}` : '/'
    }

    const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
    const hasMore = pagination.page < totalPages

    return (
        <main className="container py-8 md:py-12 relative">
            {/* Grid Pattern Background */}
            <div className="pointer-events-none absolute inset-0 -z-10 grid-pattern opacity-50" />

            {/* Announcement Banner - Neo Brutalism Style */}
            {announcement && (
                <section className="mb-8">
                    <div className="relative bg-secondary border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFFDF5] p-4 transform -rotate-1">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                            <p className="font-bold text-foreground leading-relaxed whitespace-pre-wrap">{announcement}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Pending Orders Notification */}
            {pendingOrders && pendingOrders.length > 0 && (
                <section className="mb-8">
                    <div className="bg-secondary border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFFDF5] p-4 transform rotate-1">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-bold">
                                    {pendingOrders.length === 1
                                        ? t('home.pendingOrder.single', { orderId: pendingOrders[0].orderId })
                                        : t('home.pendingOrder.multiple', { count: pendingOrders.length })
                                    }
                                </p>
                            </div>
                            <Link href={pendingOrders.length === 1 ? `/order/${pendingOrders[0].orderId}` : '/orders'}>
                                <Button size="sm" variant="outline">
                                    {pendingOrders.length === 1 ? t('common.payNow') : t('common.viewOrders')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Visitor Count - Neo Brutalism Style */}
            {typeof visitorCount === 'number' && (
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFDF5] transform rotate-1">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="font-black text-lg uppercase">{t('home.visitorCount', { count: visitorCount })}</span>
                    </div>
                </div>
            )}

            {/* Search and Filter Area */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                    {/* Search Bar */}
                    <form className="flex-1 relative" method="get" action="/">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <Input
                            placeholder={t('common.searchPlaceholder')}
                            defaultValue={searchTerm}
                            name="q"
                            className="pl-14"
                        />
                        {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
                        {sortKey && sortKey !== 'default' && <input type="hidden" name="sort" value={sortKey} />}
                    </form>

                    {/* Category Pills */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant={selectedCategory === null ? "default" : "outline"}
                            size="sm"
                            asChild
                        >
                            <Link href={buildUrl({ q: searchTerm, category: null, sort: sortKey, page: 1 })}>{t('common.all')}</Link>
                        </Button>
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                asChild
                            >
                                <Link href={buildUrl({ q: searchTerm, category, sort: sortKey, page: 1 })}>
                                    {categoryConfig?.length
                                        ? `${categoryConfig.find(c => c.name === category)?.icon ? `${categoryConfig.find(c => c.name === category)?.icon} ` : ''}${category}`
                                        : category}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <span className="font-bold uppercase text-sm">{t('home.sort.title')}:</span>
                    {[
                        { key: 'default', label: t('home.sort.default') },
                        { key: 'stockDesc', label: t('home.sort.stock') },
                        { key: 'soldDesc', label: t('home.sort.sold') },
                        { key: 'priceAsc', label: t('home.sort.priceAsc') },
                        { key: 'priceDesc', label: t('home.sort.priceDesc') },
                    ].map(opt => (
                        <Button
                            key={opt.key}
                            variant={sortKey === opt.key ? "default" : "outline"}
                            size="sm"
                            asChild
                        >
                            <Link href={buildUrl({ q: searchTerm, category: selectedCategory, sort: opt.key, page: 1 })}>
                                {opt.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <section className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-muted border-4 border-black dark:border-white transform rotate-12 animate-spin-slow hidden lg:block" />
                <div className="absolute top-20 -right-4 w-12 h-12 bg-secondary border-4 border-black dark:border-white rounded-full hidden lg:block" />

                {products.length === 0 ? (
                    <div className="bg-white dark:bg-card border-4 border-black dark:border-white shadow-[12px_12px_0px_0px_#000] dark:shadow-[12px_12px_0px_0px_#FFFDF5] p-12 text-center relative overflow-hidden">
                        {/* Background Grid */}
                        <div className="absolute inset-0 grid-pattern opacity-50" />

                        {/* Decorative Text */}
                        <div className="absolute top-4 left-4 text-8xl font-black text-stroke opacity-20 transform -rotate-12 hidden sm:block">
                            SHOP
                        </div>
                        <div className="absolute bottom-4 right-4 text-6xl font-black text-stroke opacity-20 transform rotate-6 hidden sm:block">
                            LDC
                        </div>

                        {/* Main Content */}
                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-32 h-32 bg-secondary border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFFDF5] mb-8 transform -rotate-3">
                                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-4">
                                <span className="inline-block transform -rotate-2 bg-primary px-4 py-2 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFDF5]">{t('home.noProducts')}</span>
                            </h2>

                            {/* Description */}
                            <p className="text-xl font-bold mb-8 max-w-md mx-auto">
                                {t('home.checkBackLater')}
                            </p>

                            {/* Decorative Stars */}
                            <div className="flex justify-center gap-4">
                                <span className="text-4xl text-primary animate-bounce" style={{ animationDelay: '0s' }}>★</span>
                                <span className="text-4xl text-secondary animate-bounce" style={{ animationDelay: '0.1s' }}>★</span>
                                <span className="text-4xl text-muted animate-bounce" style={{ animationDelay: '0.2s' }}>★</span>
                            </div>
                        </div>

                        {selectedCategory && (
                            <Button variant="link" asChild className="mt-4">
                                <Link href={buildUrl({ q: searchTerm, category: null, sort: sortKey, page: 1 })}>{t('common.all')}</Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                        {products.map((product, index) => (
                            <Card
                                key={product.id}
                                className="group overflow-hidden cursor-pointer"
                            >
                                {/* Image Section */}
                                <Link href={`/buy/${product.id}`} className="block relative h-48 bg-secondary border-b-4 border-black dark:border-white overflow-hidden">
                                    <div className="absolute inset-0 halftone opacity-20" />
                                    <img
                                        src={product.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`}
                                        alt={product.name}
                                        loading={index < 2 ? "eager" : "lazy"}
                                        decoding="async"
                                        fetchPriority={index < 2 ? "high" : "auto"}
                                        className="object-contain w-full h-full relative z-10"
                                    />
                                    {/* Hot Badge */}
                                    {product.isHot && (
                                        <div className="absolute -top-2 -right-2 bg-primary px-3 py-1 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFDF5] transform rotate-6 font-black text-sm uppercase z-20">
                                            🔥 {t('buy.hot')}
                                        </div>
                                    )}
                                    {/* Category Badge */}
                                    {product.category && product.category !== 'general' && (
                                        <Badge className="absolute top-2 left-2 transform -rotate-3" variant="secondary">
                                            {product.category}
                                        </Badge>
                                    )}
                                </Link>

                                {/* Content Section */}
                                <CardContent className="flex-1">
                                    <Link href={`/buy/${product.id}`} className="block">
                                        <h3 className="font-black text-xl uppercase tracking-tight mb-2 line-clamp-1" title={product.name}>
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {/* Rating */}
                                    {product.reviewCount !== undefined && product.reviewCount > 0 && (
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <StarRatingStatic rating={Math.round(product.rating || 0)} size="xs" />
                                            <span className="text-xs font-bold">({product.reviewCount})</span>
                                        </div>
                                    )}

                                    <p className="font-bold text-foreground/60 text-sm line-clamp-2">
                                        {product.descriptionPlain || product.description || t('buy.noDescription')}
                                    </p>
                                </CardContent>

                                {/* Footer Section - Neo Brutalism style with upstream structure */}
                                <CardFooter className="flex items-center justify-between gap-3">
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-black text-2xl text-primary">{Number(product.price)}</span>
                                            <span className="text-xs font-bold uppercase">{t('common.credits')}</span>
                                            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                                                <span className="text-xs text-foreground/50 line-through">
                                                    {Number(product.compareAtPrice)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/60">
                                            <span>{t('admin.products.stock')}: {product.stockCount >= 999999 ? '∞' : product.stockCount}</span>
                                            <span>|</span>
                                            <span>{t('common.sold')}: {product.soldCount}</span>
                                        </div>
                                    </div>

                                    <Link href={`/buy/${product.id}`}>
                                        <Button
                                            size="sm"
                                            variant={product.stockCount > 0 ? "default" : "outline"}
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

            {/* Pagination */}
            {products.length > 0 && (
                <div className="flex items-center justify-between mt-10">
                    <span className="font-bold uppercase">
                        {t('search.page', { page: pagination.page, totalPages })}
                    </span>
                    {hasMore && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={buildUrl({ q: searchTerm, category: selectedCategory, sort: sortKey, page: pagination.page + 1 })}>
                                {t('common.loadMore')}
                            </Link>
                        </Button>
                    )}
                </div>
            )}
        </main>
    )
}
