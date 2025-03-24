"use client"

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function BrowseByTaxonomy({animaliaCount, plantaeCount}: {animaliaCount: number, plantaeCount: number}) {
    const t = useTranslations("Common")
    return (
        <div className='flex flex-col md:flex-row w-full gap-4 mb-8'>
            <Link
                href={`/species-list?kingdom=animalia`}
                className='border border-sky-800 border-l-10 border-l-sky-800 p-8 text-center flex items-center justify-center flex-1 text-xl font-medium bg-slate-100 hover:bg-sky-800 hover:text-white transition'
            >
                <p>
                    {t("browse_animals")} <br />
                    <span className="text-sm font-normal">{animaliaCount} {t("species_animalia")}</span>
                </p>

            </Link>
            <Link
                href={`/species-list?kingdom=plantae`}
                className='border border-sky-800 border-l-10 border-l-sky-800 p-8 text-center flex items-center justify-center flex-1 text-xl font-medium bg-slate-100 hover:bg-sky-800 hover:text-white transition'
            >
                <p>
                    {t("browse_plants")} <br />
                    <span className="text-sm font-normal">{plantaeCount} {t("species_plantae")}</span>
                </p>

            </Link>
        </div>
    )
}