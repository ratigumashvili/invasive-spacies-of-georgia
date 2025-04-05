import { useTranslations } from "next-intl"
import { ClockArrowUpIcon, DatabaseIcon, HandshakeIcon } from "lucide-react"

import { cn, generateFontByLocale } from "@/lib/utils"

export function HomePageInfoCardNew({
    locale,
    totalRecords,
    totalContributions,
    totalPending,
}: {
    locale: string,
    totalRecords: number,
    totalContributions: number,
    totalPending: number,
}) {

    const t = useTranslations("Common")

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 mb-8 gap-6">
            <div className="col-span-1 p-6 bg-slate-300 rounded-md text-sky-950">
                <h2 className={cn("uppercase text-xl flex gap-2 mb-2", generateFontByLocale(locale))}>
                    <DatabaseIcon /> {t("total")}
                </h2>
                <p className="text-5xl font-medium">{totalRecords}</p>
            </div>
            <div className="col-span-1 p-6 bg-slate-300 rounded-md text-sky-950">
                <h2 className={cn("uppercase text-xl flex gap-2 mb-2", generateFontByLocale(locale))}>
                    <HandshakeIcon /> {t("contributed")}
                </h2>
                <p className="text-5xl font-medium">{totalContributions}</p>
            </div>
            <div className="col-span-1 p-6 bg-slate-300 rounded-md text-sky-950">
                <h2 className={cn("uppercase text-xl flex gap-2 mb-2", generateFontByLocale(locale))}>
                    <ClockArrowUpIcon /> {t("pending")}
                </h2>
                <p className="text-5xl font-medium">{totalPending}</p>
            </div>
        </div>
    )
}