"use client"

import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { generateFontByLocale } from "@/lib/utils";

const items = [
    {
        id: 1,
        title: "documents",
        list: [
            {
                id: 1.1,
                title: "legal_docs",
                path: "/legal-docs"
            },
            {
                id: 1.2,
                title: "scientific_literature",
                path: "/literature"
            },
            {
                id: 1.3,
                title: "research",
                path: "/research"
            }
        ]
    },
    {
        id: 2,
        title: "explore_ISG_data",
        list: [
            {
                id: 2.1,
                title: "species_list",
                path: "/species-list"
            },
            {
                id: 2.2,
                title: "places_list",
                path: "/places"
            },
            {
                id: 2.3,
                title: "species_search",
                path: "/search"
            },
        ]
    },
    {
        id: 3,
        title: "citizen_science",
        list: [
            {
                id: 3.1,
                title: "report_species",
                path: "/dashboard",
            },
            {
                id: 3.2,
                title: "join_the_editorial_board",
                path: "/",
            },
            {
                id: 3.3,
                title: "join_our_community",
                path: "/"
            }
        ]
    }
];

export function HomePageActions() {
    
    const t = useTranslations("actions")
    const locale = useLocale()
    
    return (
        <div className="flex flex-col md:flex-row gap-6 mb-8">
            {items.map((item) => (
                <Card key={item.id} className='bg-slate-100 rounded-none flex-1 border-sky-800 border-l-10'>
                    <CardHeader>
                        <CardTitle className={`${generateFontByLocale(locale)} text-xl uppercase`}>{t(item.title)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className='flex flex-col gap-2'>
                            {item.list.map((listItem) => (
                                <li key={listItem.id} className="hover:translate-x-3 transition-transform">
                                    <Link href={listItem.path} className='link block'>
                                        {t(listItem.title)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}