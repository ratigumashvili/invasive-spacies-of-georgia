"use client"

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { separator } from "@/lib/utils";

import { Species } from "@/types/specie-response";

type SingleTaxonMetaProps = {
    data: Species[];
};

export function SingleTaxonMeta({ data }: SingleTaxonMetaProps) {
    const t = useTranslations("Species")

    function detectLifeForm(type: string) {
        if (type === "terrestrial") {
            return t("terrestrial")
        }
        if (type === "aquatic") {
            return t("aquatic")
        }
        if (type === "semiaquatic") {
            return t("semiaquatic")
        } else {
            return
        }
    }

    return (
        <div className="border border-sky-800 border-l-8 bg-slate-50 my-8 md:my-0 p-4">
            <h2 className="text-2xl font-medium mb-4">
                <em>{data[0]?.name}</em> {`(${data[0]?.autorName})`}
            </h2>

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
                <dt>{t("scientific_name")}</dt>
                <dd><em>{data[0]?.name}</em></dd>
                <dt>{t("nat")}</dt>
                <dd>{data[0]?.autorName}</dd>
            </dl>

            <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("metadata")}</h3>

            <dl className="data-list">
                <dt>{t("name_id")}</dt>
                <dd>
                    <Link href={`${data[0]?.scientificNameUrl ?? '#'}`} target="blank">
                        {data[0]?.scientificNameId}
                    </Link>
                </dd>
                <dt>{t("HabitatType")}</dt>
                <dd>
                    {data[0]?.habitats?.map((item, index) => (
                        <Popover key={index}>
                            <PopoverTrigger className="cursor-help">{item.code} - {item.name}{separator(index, data[0]?.habitats,)}</PopoverTrigger>
                            <PopoverContent className="max-h-[300px] overflow-y-scroll">
                                {item.description}
                            </PopoverContent>
                        </Popover>
                    ))}
                </dd>
                <dt>{t("eco_group")}</dt>
                <dd>{detectLifeForm(data[0]?.lifeForm as string)}</dd>
                <dt>{t("status")}</dt>
                <dd>{data[0]?.taxonStatus && data[0]?.taxonStatus === "non-invasive" ? t("non-native") : t("invasive")}</dd>
                <dt>{t("risk_assessed")}</dt>
                <dd>
                    {data[0]?.riskAssessed && data[0]?.riskAssessed === "yes"
                        ? (<Link href={`${data[0]?.riskAssessedUrl ?? '#'}`} target="blank">
                            {t("yes")}
                        </Link>)
                        : (<>{t("no")}</>)}
                </dd>
                <dt>{t("first_introduced")}</dt>
                <dd>{data[0]?.firstRecorded}</dd>
                <dt>{t("recordsNumber")}</dt>
                <dd>{data[0]?.places?.length}</dd>
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