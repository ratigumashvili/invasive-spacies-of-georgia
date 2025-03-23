import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { generateFontByLocale } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function HomePageInfoCard({ 
    locale, 
    title, 
    description, 
    total, 
    percentage 
}: { 
    locale: "ka" | "en", 
    title: string, 
    description?: string, 
    total: number, 
    percentage?: number 
}) {
    const t = useTranslations("Common")
    return (
            <Card className='bg-slate-100 rounded-none flex-1 border-sky-800 border-l-10'>
                <CardHeader>
                    <CardTitle className={`${generateFontByLocale(locale)} text-xl uppercase`}>
                    {t(title)} {total}
                    </CardTitle>
                    <CardDescription className="text-sm">
                        {percentage ? locale === "ka" ? `${t(description)} ${percentage}%` : `${percentage}% ${t(description)}` : ""}
                    </CardDescription>
                </CardHeader>
            </Card>
    )
}