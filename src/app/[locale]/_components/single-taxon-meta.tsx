"use client"

import { SpeciesEntity } from "@/types/taxonomy-types";

type SingleTaxonMetaProps = {
    data: SpeciesEntity[];
};

export function SingleTaxonMeta({ data }: SingleTaxonMetaProps) {
    return (
        <div className="border border-sky-800 border-l-8 bg-slate-50 my-8 p-4">
            <h2 className="text-xl font-medium mb-4">{data[0]?.name}</h2>
            <dl className="data-list">
                <dt>Coffee</dt>
                <dd>Black hot drink</dd>
                <dt>Milk</dt>
                <dd>White cold drink</dd>
            </dl>
        </div>
    )
}