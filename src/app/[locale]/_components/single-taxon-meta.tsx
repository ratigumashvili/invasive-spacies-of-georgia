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
            <h2 className="text-2xl font-medium mb-4">{data[0]?.name}</h2>

            <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("metadata")}</h3>

            <dl className="data-list">
                <dt>{t("scientific_name")}</dt>
                <dd>{data[0]?.name}</dd>
                <dt>{t("name_id")}</dt>
                <dd>456</dd>
                <dt>{t("nat")}</dt>
                <dd>{data[0]?.autorName}</dd>
                <dt>{t("eco_group")}</dt>
                <dd>{data[0]?.ecologicalGroup}</dd>
                <dt>{t("status")}</dt>
                <dd>Alien</dd>
                <dt>{t("enviroments")}</dt>
                <dd>Freshwater, Terrestrial</dd>
                <dt>{t("concern")}</dt>
                <dd>Yes</dd>
                <dt>{t("partly_native")}</dt>
                <dd>Yes</dd>
                <dt>{t("horizon_scaning")}</dt>
                <dd>No</dd>
                <dt>{t("impact")}</dt>
                <dd>Yes</dd>
                <dt>{t("impact_source")}</dt>
                <dd>CABI NOBANIS SEBI</dd>
            </dl>

            <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("taxonomy")}</h3>

            <dl className="data-list">
                <dt>{t("kingdom")}</dt>
                <dd>{data[0]?.kingdom.name}</dd>
            </dl>
        </div>
    )
}