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
        <div className="bg-sky-950 text-white grid grid-cols-1 md:grid-cols-3 mb-8 p-2 rounded-md">
            <div className="col-span-1 border-r-none md:border-r md:border-r-white/50 p-6">
                <h2 className={cn("uppercase text-xl", generateFontByLocale(locale))}>
                    {t("total")}
                </h2>
                <p className="text-5xl">{totalRecords}</p>
            </div>
            <div className="col-span-1 border-r-none md:border-r md:border-r-white/50 p-6">
                <h2 className={cn("uppercase text-xl", generateFontByLocale(locale))}>
                    {t("contributed")}
                </h2>
                <p className="text-5xl">{totalContributions}</p>
            </div>
            <div className="col-span-1 p-6">
                <h2 className={cn("uppercase text-xl", generateFontByLocale(locale))}>
                    {t("pending")}
                </h2>
                <p className="text-5xl">{totalPending}</p>
            </div>
        </div>
    )
}