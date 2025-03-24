"use client"

import { useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { DownloadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SpecieBlock } from "@/app/[locale]/_components/home-page-blocks/specie-block"
import { Views } from "@/app/[locale]/_components/views"
import { SpeciesTable } from "@/app/[locale]/_components/species-table"

import { generateFontByLocale, isLocalStorageAvailable } from "@/lib/utils"

import { SingleSpecieList } from "@/types/random-specie"

export function SpeciesListClient({ response }: { response: any }) {
    const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");

    useEffect(() => {
            if (!isLocalStorageAvailable()) return;
    
            const storedView = localStorage.getItem("view");
            if (storedView === "list" || storedView === "grid") {
                setSelectedView(storedView);
            }
        }, []);

    const locale = useLocale()

    const t = useTranslations("Common")

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium`}>
                    {t("species_list")}
                </h1>
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="rounded-none cursor-pointer">
                        <DownloadIcon />
                    </Button>
                    <Views selectedView={selectedView} setSelectedView={setSelectedView} />
                </div>
            </div>

            <Separator className="mb-8" />

            {selectedView === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {response?.data?.map((item: SingleSpecieList) => (
                    <SpecieBlock key={item.documentId} data={item as SingleSpecieList} />
                ))}
            </div>
            ) : (
                <SpeciesTable data={response.data} />
            )}
        </div>
    )
}