"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

export function SearchResults() {
    const searchParams = useSearchParams()
    const t = useTranslations("Search")
    return (
        <section className="my-8 border p-4">
            {t("searched_for")}: <span className="font-medium">{t("name")}</span>: {searchParams.get("name")}, <span className="font-medium">{t("type")}</span>: {searchParams.get("type")}
        </section>
    )
}