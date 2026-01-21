'use client'

import { useI18n } from "@/lib/i18n/context"

export function SiteFooter() {
    const { t } = useI18n()

    return (
        <footer className="border-t-4 border-border py-6 md:py-0 bg-secondary">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-xs leading-loose text-foreground font-bold uppercase md:text-left">
                        {t('footer.disclaimer')}
                    </p>
                </div>
                <a href="https://chatgpt.org.uk" target="_blank" rel="noreferrer" className="text-center text-xs md:text-left text-foreground font-bold uppercase hover:text-primary transition-colors duration-200">
                    {t('footer.poweredBy')}
                </a>
                <a href="https://github.com/chatgptuk/ldc-shop" target="_blank" rel="noreferrer" className="inline-block px-3 py-1 bg-primary text-foreground font-bold text-xs uppercase border-4 border-border neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-100">
                    v0.2.3
                </a>
            </div>
        </footer>
    )
}
