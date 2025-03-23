"use client"

import { useTranslations } from "next-intl";

import { SpeciesEntity } from "@/types/taxonomy-types";
import { Species } from "@/types/specie-response";

type SingleTaxonMetaProps = {
    data: Species[];
};

export function SingleTaxonMeta({ data }: SingleTaxonMetaProps) {
    const t = useTranslations("Species")

    function detectGroup(type: string) {
        if(type === "water") {
            return t("water")
        } 
        if (type === "land") {
            return t("land")
        } else {
            return
        }
    }

    return (
        <div className="border border-sky-800 border-l-8 bg-slate-50 my-8 md:my-0 p-4">
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
                <dd>{detectGroup(data[0]?.ecologicalGroup as string)}</dd>
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
                <dd>{data[0]?.kingdom?.name}</dd>
                <dt>{t("phylum")}</dt>
                <dd>{data[0]?.phylum?.name}</dd>
                <dt>{t("class")}</dt>
                <dd>{data[0]?.class?.name}</dd>
                <dt>{t("order")}</dt>
                <dd>{data[0]?.order?.name}</dd>
                <dt>{t("family")}</dt>
                <dd>{data[0]?.family?.name}</dd>
                <dt>{t("genus")}</dt>
                <dd>{data[0]?.genus?.name}</dd>
            </dl>

            <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("ai")}</h3>

            <div className="rich-text">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa dignissimos, nisi ullam quis dolore optio esse atque quasi placeat odio nesciunt deleniti iure ex, vero doloremque. Temporibus aliquid animi ex!</p>
            </div>

            <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("assessments")}</h3>

            <div className="rich-text">
                <p>According to Commission Delegated Regulation (EU) 2018/968</p>
            </div>

            <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("common_names")}</h3>

            <div className="rich-text">
                <p>Floating pennywort, Grote waternavel, Hydrocotyle à feuilles de renoncule, Soldinella reniforme</p>
            </div>

            <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("synonyms")}</h3>

            <div className="rich-text">
                <p>Hydrocotyle batrachioides, Hydrocotyle cymbalarifolia, Hydrocotyle natans, Hydrocotyle nutans</p>
            </div>

        </div>
    )
}