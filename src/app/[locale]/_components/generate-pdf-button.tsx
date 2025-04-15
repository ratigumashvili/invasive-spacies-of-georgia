"use client";

import jsPDF from "jspdf";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { Species } from "@/types/specie-response";
import { useTranslations } from "next-intl";

export function GeneratePdfButton({ data }: { data: Species }) {
    const t = useTranslations("Species");

    const detectLifeForm = (type: string) => {
        switch (type) {
            case "terrestrial": return t("terrestrial");
            case "aquatic": return t("aquatic");
            case "semiaquatic": return t("semiaquatic");
            default: return "-";
        }
    };

    function renderStyledText(pdf: jsPDF, text: string, x: number, y: number) {
        const words = text.split(/(\s+)/);
        let cursorX = x;

        words.forEach((word) => {
            let fontStyle: "normal" | "bold" | "italic" = "normal";
            let underline = false;
            let strike = false;

            let cleaned = word;

            if (/\[(.+)\]\((.+)\)/.test(cleaned)) {
                const match = cleaned.match(/\[(.+)\]\((.+)\)/);
                if (match) {
                    const [_, text, href] = match;
                    const textWidth = pdf.getTextWidth(text);
                    pdf.setTextColor(0, 0, 255);
                    pdf.textWithLink(text, cursorX, y, { url: href });
                    pdf.setTextColor(0);
                    cursorX += textWidth;
                    return;
                }
            }

            if (/^\*\*(.+)\*\*$/.test(cleaned)) {
                fontStyle = "bold";
                cleaned = cleaned.replace(/^\*\*(.+)\*\*$/, "$1");
            }

            if (/^_(.+)_$/.test(cleaned)) {
                fontStyle = "italic";
                cleaned = cleaned.replace(/^_(.+)_$/, "$1");
            }

            if (/^<u>(.+)<\/u>$/.test(cleaned)) {
                underline = true;
                cleaned = cleaned.replace(/^<u>(.+)<\/u>$/, "$1");
            }

            if (/^~~(.+)~~$/.test(cleaned)) {
                strike = true;
                cleaned = cleaned.replace(/^~~(.+)~~$/, "$1");
            }

            pdf.setFont("helvetica", fontStyle);
            const textWidth = pdf.getTextWidth(cleaned);

            pdf.text(cleaned, cursorX, y);
            if (underline) pdf.line(cursorX, y + 1, cursorX + textWidth, y + 1);
            if (strike) pdf.line(cursorX, y - 2, cursorX + textWidth, y - 2);

            cursorX += textWidth;
        });
    }

    function renderMarkdown(pdf: jsPDF, markdown: string, x: number, y: number): number {
        const tokens = marked.lexer(markdown);
        pdf.setFont("helvetica");
        pdf.setFontSize(11);

        tokens.forEach((token) => {
            if (token.type === "heading") {
                y += 10;
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(10 - token.depth);
                pdf.text(token.text, x, y);
                y += 8;
              }

            if (token.type === "paragraph") {
                const lines = pdf.splitTextToSize(token.text, 180);
                lines.forEach((line: any) => {
                    renderStyledText(pdf, line, x, y);
                    y += 6;
                });
            }

            if (token.type === "list") {
                token.items.forEach((item: any, idx: number) => {
                    const bullet = token.ordered ? `${idx + 1}.` : "•";
                    const lines = pdf.splitTextToSize(`${bullet} ${item.text}`, 180);
                    lines.forEach((line: any) => {
                        pdf.text(line, x + 5, y);
                        y += 6;
                    });
                });
            }

            if (token.type === "blockquote") {
                pdf.setTextColor(100);
                pdf.setFont("helvetica", "italic");
                const lines = pdf.splitTextToSize(token.text, 180);
                lines.forEach((line: any) => {
                    pdf.text(line, x + 5, y);
                    y += 6;
                });
                pdf.setTextColor(0);
            }

            if (token.type === "code") {
                pdf.setFont("courier", "normal");
                const lines = pdf.splitTextToSize(token.text, 180);
                lines.forEach((line: any) => {
                    pdf.text(line, x + 5, y);
                    y += 6;
                });
            }

            if (token.type === "space") {
                y += 4;
            }
        });

        return y;
    }

    async function generateTextBasedPdf(specie: Species) {
        const pdf = new jsPDF();
        let y = 20;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text(`${specie.name} (${specie.autorName})`, 14, y);
        y += 10;

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Taxonomy", 12, y);
        y += 10;

        const taxonomy: [string, string | undefined, boolean?, string?][] = [
            ["Kingdom", specie.kingdom?.name],
            ["Phylum", specie.phylum?.name],
            ["Class", specie.class?.name],
            ["Order", specie.order?.name],
            ["Family", specie.family?.name],
            ["Genus", specie.genus?.name],
            ["Scientific Name", specie.name, true],
            ["Author Name", specie.autorName],
        ];

        taxonomy.forEach(([label, value, isItalic, link]) => {
            pdf.setFont("helvetica", isItalic ? "italic" : "normal");
            pdf.setFontSize(11);
            pdf.text(`${label}:`, 12, y);

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

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text("Metadata", 12, y);
        y += 10;

        const metadata: [string, string | number | null | undefined, boolean?, string?][] = [
            ["Taxon ID", specie.scientificNameId, false, specie.scientificNameUrl],
            ["Habitat Types", specie.habitats?.map((h) => `${h.code} - ${h.name}`).join(", ")],
            ["Ecological Group", detectLifeForm(specie?.lifeForm as string)],
            ["Status", specie?.taxonStatus === "non-invasive" ? t("non-native") : t("invasive")],
            ["Risk Assessed", t(specie?.riskAssessed), false, specie.riskAssessedUrl],
            ["Number of Records", specie.places?.length],
        ];

        metadata.forEach(([label, value, isItalic, link]) => {
            const displayValue = String(value ?? "-");
            pdf.setFont("helvetica", isItalic ? "italic" : "normal");
            pdf.setFontSize(11);
            pdf.text(`${label}:`, 12, y);

            if (link) {
                pdf.setTextColor(0, 0, 255);
                pdf.textWithLink(displayValue, 60, y, { url: link });
                pdf.setTextColor(0, 0, 0);
            } else {
                pdf.text(displayValue, 60, y);
            }
            y += 8;
        });

        const sections: [string, string | null | undefined][] = [
            ["Identification", specie.identification],
            ["Ecology", specie.ecology],
            ["Distribution", specie.distribution],
            ["Invasion History", specie.invasionHistory],
            ["Impact", specie.impact],
            ["What Can I Do?", specie.wcid],
            ["References", specie.references],
        ];

        for (const [title, markdown] of sections) {
            if (!markdown) continue;

            if (y > 250) {
                pdf.addPage();
                y = 10;
            }

            y += 3;

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text(title, 12, y);
            y += 8;

            y = renderMarkdown(pdf, markdown, 12, y);
            y += 2;
        }

        pdf.save(`${specie.name || "species-details"}.pdf`);
    }

    return (
        <Button
            onClick={() => generateTextBasedPdf(data)}
            size="lg"
            variant="blue"
            className="mt-8 cursor-pointer print:hidden"
        >
            {t("generatePdf")}
        </Button>
    );
}
