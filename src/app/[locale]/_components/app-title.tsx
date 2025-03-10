"use client"

import { cn, generateFontByLocale } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"

export function AppTitle() {
    const locale = useLocale()
    const t = useTranslations("Common")

    return (
        <div className="flex flex-col gap-2 items-center mb-8">
            <h1 className={cn(
                "text-4xl racking-tight font-semibold uppercase",
                generateFontByLocale(locale)
            )}>{t("title")}</h1>
            <h2 className="text-lg text-muted-foreground">{t("osd")}</h2>
        </div>
    )
}