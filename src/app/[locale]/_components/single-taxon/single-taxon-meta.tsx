"use client"

import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { jsPDF } from "jspdf";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { renderBlocksContentToPdf, separator } from "@/lib/utils";

import { Species } from "@/types/specie-response";
import { Button } from "@/components/ui/button";

type SingleTaxonMetaProps = {
    data: Species[];
};


export function SingleTaxonMeta({ data }: SingleTaxonMetaProps) {
    const t = useTranslations("Species")

    const defaultContent: BlocksContent = [];

    const identificationContent = (data[0]?.identification as BlocksContent) ?? defaultContent;
    const ecologyContent = (data[0]?.ecology as BlocksContent) ?? defaultContent;
    const distributionContent = (data[0]?.distribution as BlocksContent) ?? defaultContent;
    const invasionHistoryContent = (data[0]?.invasionHistory as BlocksContent) ?? defaultContent;
    const impactContent = (data[0]?.impact as BlocksContent) ?? defaultContent;
    const wcidContent = (data[0]?.wcid as BlocksContent) ?? defaultContent;
    const referencesContent = (data[0]?.references as BlocksContent) ?? defaultContent;

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

    function generateTextBasedPdf(data: Species) {
        const pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text(`${data.name} (${data.autorName})`, 14, 20);

        pdf.setFontSize(14);
        pdf.text("Taxonomy", 14, 30);

        const taxonomy: [string, string | undefined, boolean?, string?][] = [
            ["Kingdom", data.kingdom?.name],
            ["Phylum", data.phylum?.name],
            ["Class", data.class?.name],
            ["Order", data.order?.name],
            ["Family", data.family?.name],
            ["Genus", data.genus?.name],
            ["Scientific Name", data.name, true],
            ["Author Name", data.autorName],
        ];

        let y = 40;
        taxonomy.forEach(([label, value, isItalic, link]) => {
            pdf.setFontSize(11);
            pdf.setFont("helvetica", "normal");
            pdf.text(`${label}:`, 14, y);

            if (isItalic) {
                pdf.setFont("helvetica", "italic");
            }

            const displayValue = value || "-";

            if (link) {
                pdf.setTextColor(0, 0, 255);
                pdf.textWithLink(displayValue, 60, y, { url: link });
                pdf.setTextColor(0, 0, 0);
            } else {
                pdf.text(displayValue, 60, y);
            }

            y += 8;
        });


        pdf.setFontSize(14);
        pdf.text("Metadata", 14, y + 6);
        y += 14;

        const metadata: [string, string | number | null | undefined, boolean?, string?][] = [
            ["Taxon ID", data.scientificNameId, false, data.scientificNameUrl],
            ["Habitat Types", data.habitats?.map((h) => `${h.code} - ${h.name}`).join(", ")],
            ["Ecological Group", detectLifeForm(data?.lifeForm as string)],
            ["Status", data?.taxonStatus && data?.taxonStatus === "non-invasive" ? t("non-native") : t("invasive")],
            ["Risk Assessed", t(data?.riskAssessed), false, data.riskAssessedUrl ? data.riskAssessedUrl : ""],
            ["First Introduced", data.firstRecorded],
            ["Number of Records", data.places?.length],
        ];

        metadata.forEach(([label, value, isItalic, link]) => {
            const displayValue = String(value ?? "-");

            pdf.setFontSize(11);
            pdf.setFont("helvetica", isItalic ? "italic" : "normal");
            pdf.text(`${label}:`, 14, y);

            if (link) {
                pdf.setTextColor(0, 0, 255);
                pdf.textWithLink(displayValue, 60, y, { url: link });
                pdf.setTextColor(0, 0, 0);
            } else {
                pdf.text(displayValue, 60, y);
            }

            y += 8;
        });

        pdf.setFontSize(12);
        pdf.text("Identification", 14, y + 6);
        y = renderBlocksContentToPdf(pdf, identificationContent, y + 14);

        pdf.setFontSize(12);
        pdf.text("Ecology", 14, y + 6);
        y = renderBlocksContentToPdf(pdf, ecologyContent, y + 14);

        pdf.setFontSize(12);
        pdf.text("Distribution", 14, y + 6);
        y = renderBlocksContentToPdf(pdf, distributionContent, y + 14);

        pdf.setFontSize(12);
        pdf.text("Invasion History", 14, y + 6);
        y = renderBlocksContentToPdf(pdf, invasionHistoryContent, y + 14);

        pdf.setFontSize(12);
        pdf.text("Impact", 14, y + 6);
        y = renderBlocksContentToPdf(pdf, impactContent, y + 14);

        pdf.setFontSize(12);
        pdf.text("What can I do", 14, y + 6);
        y = renderBlocksContentToPdf(pdf, wcidContent, y + 14);

        pdf.setFontSize(12);
        pdf.text("References", 14, y + 6);
        y = renderBlocksContentToPdf(pdf, referencesContent, y + 14);

        pdf.save(`${data.name || "species-details"}.pdf`);
    }

    return (
        <>
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
                                <PopoverContent className="max-h-[300px] rounded-none overflow-y-scroll">
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

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("identification")}</h3>

                <div className="rich-text">
                    <BlocksRenderer content={identificationContent} />
                </div>

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("ecology")}</h3>

                <div className="rich-text">
                    <BlocksRenderer content={ecologyContent} />
                </div>

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("distribution")}</h3>

                <div className="rich-text">
                    <BlocksRenderer content={distributionContent} />
                </div>

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("invasionHistory")}</h3>

                <div className="rich-text">
                    <BlocksRenderer content={invasionHistoryContent} />
                </div>

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("impact")}</h3>

                <div className="rich-text">
                    <BlocksRenderer content={impactContent} />
                </div>

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("wcid")}</h3>

                <div className="rich-text">
                    <BlocksRenderer content={wcidContent} />
                </div>

                <h3 className="text-lg font-medium my-4 text-muted-foreground">{t("references")}</h3>

                <div className="rich-text">
                    <BlocksRenderer content={referencesContent} />
                </div>

            </div>

            <Button
                onClick={() => generateTextBasedPdf(data[0])}
                size="lg"
                className="mt-8 rounded-none cursor-pointer"
            >
                Generate PDF
            </Button>
        </>
    )
}