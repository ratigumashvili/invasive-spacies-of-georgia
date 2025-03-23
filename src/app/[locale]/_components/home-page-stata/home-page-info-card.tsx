import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { generateFontByLocale } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function HomePageInfoCard({ locale, title, total, percentage }: { locale: string, title: string, total: number, percentage?: number }) {
    const t = useTranslations("Common")
    return (
            <Card className='bg-slate-100 rounded-none flex-1 border-sky-800 border-l-10'>
                <CardHeader>
                    <CardTitle className={`${generateFontByLocale(locale)} text-xl uppercase`}>
                    {t(title)} {total}
                    </CardTitle>
                    <CardDescription className="text-sm">5% of text</CardDescription>
                </CardHeader>
            </Card>
    )
}