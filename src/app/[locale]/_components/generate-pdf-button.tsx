
"use client"

import jsPDF from "jspdf";
import { useTranslations } from "next-intl";
import { BlocksContent } from "@strapi/blocks-react-renderer";

import { Button } from "@/components/ui/button";
import { renderBlocksContentToPdf } from "@/lib/utils";
import { Species } from "@/types/specie-response";

export function GeneratePdfButton({ data }: { data: Species }) {

    const t = useTranslations("Species")

    const defaultContent: BlocksContent = [];

    const identificationContent = (data?.identification as BlocksContent) ?? defaultContent;
    const ecologyContent = (data?.ecology as BlocksContent) ?? defaultContent;
    const distributionContent = (data?.distribution as BlocksContent) ?? defaultContent;
    const invasionHistoryContent = (data?.invasionHistory as BlocksContent) ?? defaultContent;
    const impactContent = (data?.impact as BlocksContent) ?? defaultContent;
    const wcidContent = (data?.wcid as BlocksContent) ?? defaultContent;
    const referencesContent = (data?.references as BlocksContent) ?? defaultContent;

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
            <Button
                onClick={() => generateTextBasedPdf(data)}
                size="lg"
                className="mt-8 rounded-none cursor-pointer print:hidden"
            >
                Generate PDF
            </Button>
        </>
    )
}