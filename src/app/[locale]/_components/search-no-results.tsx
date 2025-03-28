"use client"

import { useTranslations } from "next-intl"

export function SearchNoResults() {
    const t = useTranslations("Search")
    return (
        <section className="mt-8">
            <h1 className="text-lg font-medium">{t("nothing_found")}</h1>
            <h2 className="text-base">{t("try_other")}</h2>
        </section>
    )
}