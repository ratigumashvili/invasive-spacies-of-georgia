"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

export function SearchResults({length}: {length: number}) {
    const searchParams = useSearchParams()
    const t = useTranslations("Search")
    return (
        <section className="mt-8 border p-4">
            {t("searched_for")}:{" "}
            <span className="font-medium">{t("name")}</span>:{" "}
            {searchParams.get("name")},{" "}
            <span className="font-medium">{t("type")}</span>:{" "}
            {searchParams.get("type")}.{" "}
            {t("found")} <span className="font-medium">{length}</span> {t("records")}
        </section>
    )
}