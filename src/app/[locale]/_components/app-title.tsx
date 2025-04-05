"use client"

import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { cn, generateFontByLocale } from "@/lib/utils"

interface AppTitleProps {
    title: string,
    subtitle: string,
    version: string
}

export function AppTitle({ title, subtitle, version }: AppTitleProps) {
    const locale = useLocale()
    const t = useTranslations("Common")

    return (
        // <div className="flex flex-col bg-white/80 p-4">
        //     <h1 className={cn(
        //         "text-4xl tracking-tight font-semibold uppercase",
        //         generateFontByLocale(locale)
        //     )}>{title}</h1>
        //     <h2 className="text-lg text-sky-800">{subtitle} <sup className="text-xs">{version}</sup></h2>
        // </div>

        <Card className="shadow-none bg-white mb-8">
            <CardHeader>
                <h1 className={cn(
                    "text-4xl tracking-tight font-semibold uppercase text-sky-950",
                    generateFontByLocale(locale)
                )}
                >
                    {title}
                </h1>
                <CardDescription>
                    <h2 className="text-lg">{subtitle} <sup className="text-xs">{version}</sup></h2>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 line-clamp-4">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate asperiores quia, maxime delectus minus 
                    architecto animi corporis error dolores atque, debitis exercitationem aliquid nostrum, ad sapiente odio laudantium 
                    excepturi quas. Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, culpa odit! Tenetur aperiam maiores 
                    pariatur ea neque quia modi ratione iure hic? Veniam ex reiciendis eveniet sapiente iste! Ratione, quasi? Lorem ipsum 
                    dolor sit amet consectetur adipisicing elit. Repellat, facilis? Ea, deleniti quis sit unde aliquid pariatur reiciendis 
                    eius explicabo provident incidunt porro iste. Nobis fugiat consectetur voluptates aliquid incidunt.
                </div>
                <Button variant="blue" className="cursor pointer" asChild>
                    <Link href={"/about"}>Read more</Link>
                </Button>
            </CardContent>
        </Card>
    )
}