'use client'

import { useI18n } from "@/lib/i18n/context"
import type { ReactNode } from "react"

interface FooterContentProps {
    customFooter: string | null
    version: string
}

export function FooterContent({ customFooter, version }: FooterContentProps) {
    const { t } = useI18n()
    const footerText = customFooter?.trim() || t('footer.disclaimer')

    const linkify = (text: string) => {
        const nodes: ReactNode[] = []
        const urlRegex = /https?:\/\/[^\s]+/g
        let lastIndex = 0
        let match: RegExpExecArray | null
        let linkIndex = 0

        while ((match = urlRegex.exec(text)) !== null) {
            const [raw] = match
            const start = match.index
            if (start > lastIndex) {
                nodes.push(text.slice(lastIndex, start))
            }

            let url = raw
            let trailing = ''
            while (url.length && /[),.!?]/.test(url[url.length - 1])) {
                trailing = url[url.length - 1] + trailing
                url = url.slice(0, -1)
            }

            if (url) {
                nodes.push(
                    <a
                        key={`footer-link-${linkIndex++}`}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary font-bold hover:text-primary transition-colors duration-100"
                    >
                        {url}
                    </a>
                )
            }
            if (trailing) nodes.push(trailing)
            lastIndex = start + raw.length
        }

        if (lastIndex < text.length) {
            nodes.push(text.slice(lastIndex))
        }

        return nodes
    }

    const renderFooterText = (text: string) => {
        const lines = text.split(/\r?\n/)
        return lines.flatMap((line, idx) => {
            const parts = linkify(line)
            if (idx < lines.length - 1) {
                return [...parts, <br key={`footer-br-${idx}`} />]
            }
            return parts
        })
    }

    return (
        <footer className="bg-black text-white border-t-4 border-black mt-16">
            <div className="container py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="font-bold text-center sm:text-left">
                        {renderFooterText(footerText)}
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/chatgptuk/ldc-shop"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 font-bold uppercase text-sm bg-secondary text-black border-4 border-white shadow-[4px_4px_0px_0px_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100"
                        >
                            v{version}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
