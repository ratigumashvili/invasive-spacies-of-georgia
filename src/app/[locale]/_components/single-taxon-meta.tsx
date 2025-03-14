"use client"

import { SpeciesEntity } from "@/types/taxonomy-types";
import { useTranslations } from "next-intl";

type SingleTaxonMetaProps = {
    data: SpeciesEntity[];
};

export function SingleTaxonMeta({ data }: SingleTaxonMetaProps) {
    const t = useTranslations("Species")
    return (
        <div className="border border-sky-800 border-l-8 bg-slate-50 my-8 p-4">
            <h2 className="text-xl font-medium mb-4">{data[0]?.name}</h2>
            <dl className="data-list">
                <dt>{t("scientific_name_id")}</dt>
                <dd>{data[0]?.name}</dd>
                <dt>{t("nat")}</dt>
                <dd>{data[0]?.autorName}</dd>
                <dd></dd>
                <dt></dt>
                <dd></dd>
                <dt></dt>
                <dd></dd>
                <dt></dt>
                <dd></dd>
                <dt></dt>
                <dd></dd>
                <dt></dt>
            </dl>
        </div>
    )
}