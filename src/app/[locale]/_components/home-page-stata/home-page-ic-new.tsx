import { useTranslations } from "next-intl"
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
            <div className="col-span-1 p-6 bg-white rounded-md text-sky-950">
                <h2 className={cn("uppercase text-xl", generateFontByLocale(locale))}>
                    {t("total")}
                </h2>
                <p className="text-5xl font-medium">{totalRecords}</p>
            </div>
            <div className="col-span-1 p-6 bg-white rounded-md text-sky-950">
                <h2 className={cn("uppercase text-xl", generateFontByLocale(locale))}>
                    {t("contributed")}
                </h2>
                <p className="text-5xl font-medium">{totalContributions}</p>
            </div>
            <div className="col-span-1 p-6 bg-white rounded-md text-sky-950">
                <h2 className={cn("uppercase text-xl", generateFontByLocale(locale))}>
                    {t("pending")}
                </h2>
                <p className="text-5xl font-medium">{totalPending}</p>
            </div>
        </div>
    )
}