"use client"

import { SpeciesEntity } from "@/types/taxonomy-types";

type SingleTaxonMetaProps = {
    data: SpeciesEntity[];
};

export function SingleTaxonMeta ({data}: SingleTaxonMetaProps) {
    return (
        <div className="border border-sky-800 border-l-8 bg-slate-50 my-8 p-4">
            <h2 className="text-xl font-medium">{data[0]?.name}</h2>
        </div>
    )
}