"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

export function SearchResults({length}: {length: number}) {
    const searchParams = useSearchParams()
    const [type, setType] = useState<string>(searchParams.get("type") || "")
    
    const t = useTranslations("Search")
    
    useEffect(() => {
        setType(searchParams.get("type") as string)
    }, [searchParams])

    return (
        <section className="mt-8 border p-4">
            {t("searched_for")}:{" "}
            <span className="font-medium">{t("name")}</span>:{" "}
            {searchParams.get("name")},{" "}
            <span className="font-medium">{t("type")}</span>:{" "}
            {t(type)}.{" "}
            {t("found")} <span className="font-medium">{length}</span> {t("records")}
        </section>
    )
}