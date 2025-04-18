"use client"

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarkDownContent from "@/app/[locale]/_components/markdown-content";

import { formatDate, getOldestDetectionDate, removeDuplicateDetectionDates, separator } from "@/lib/utils";

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

    const detectionDates = removeDuplicateDetectionDates(
        data[0]?.detectionDate || []
    );

    const oldest = getOldestDetectionDate(data[0]?.detectionDate || []);

    return (
        <Card className="my-8 md:my-0 shadow-none">
            <CardHeader>
                <CardTitle>
                    <h2 className="text-2xl font-medium">
                        <em>{data[0]?.name}</em> {`(${data[0]?.autorName})`}
                    </h2>
                </CardTitle>
            </CardHeader>

            <CardContent>
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
                        <Link href={`${data[0]?.scientificNameUrl ?? '#'}`} className="underline" target="blank">
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
                    <dd>{data[0]?.taxonStatus && data[0]?.taxonStatus === "non-native" ? t("non-native") : t("invasive")}</dd>
                    <dt>{t("risk_assessed")}</dt>
                    <dd>
                        {data[0]?.riskAssessed && data[0]?.riskAssessed === "yes"
                            ? (<Link href={`${data[0]?.riskAssessedUrl ?? '#'}`} className="underline" target="blank">
                                {t("yes")}
                            </Link>)
                            : (<>{t("no")}</>)}
                    </dd>
                    <dt>{t("first_introduced")}</dt>
                    <dd>{formatDate(oldest?.day, oldest?.month, oldest?.year)}</dd>
                    <dt>{t("dateDetected")}</dt>
                    <dd>
                        {detectionDates.map((date, index) => (
                            <span key={date.id}>{formatDate(date.day, date.month, date.year)}{separator(index, detectionDates)}</span>
                        ))}
                    </dd>
                    <dt>{t("recordsNumber")}</dt>
                    <dd>{data[0]?.places?.length}</dd>
                </dl>

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("identification")}</h3>

                <MarkDownContent markdown={data[0]?.identification} />

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("ecology")}</h3>

                <MarkDownContent markdown={data[0]?.ecology} />

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("distribution")}</h3>

                <MarkDownContent markdown={data[0]?.distribution} />

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("invasionHistory")}</h3>

                <MarkDownContent markdown={data[0]?.invasionHistory} />

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("impact")}</h3>

                <MarkDownContent markdown={data[0]?.impact} />

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("wcid")}</h3>

                <MarkDownContent markdown={data[0]?.wcid} />

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("references")}</h3>

                <MarkDownContent markdown={data[0]?.references} />
            </CardContent>

        </Card>
    )
}