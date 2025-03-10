"use client"

import { cn, generateFontByLocale } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"

interface AppTitleProps {
    title: string,
    subtitle: string,
    version: string
}

export function AppTitle({ title, subtitle, version }: AppTitleProps) {
    const locale = useLocale()
    const t = useTranslations("Common")

    return (
        <div className="flex flex-col bg-white/80 p-4">
            <h1 className={cn(
                "text-4xl racking-tight font-semibold uppercase",
                generateFontByLocale(locale)
            )}>{title}</h1>
            <h2 className="text-xl text-muted-foreground">{subtitle} <sup className="text-xs">{version}</sup></h2>
        </div>
    )
}