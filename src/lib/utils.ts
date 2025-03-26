import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jsPDF } from "jspdf";
import { BlocksContent } from "@strapi/blocks-react-renderer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateFontByLocale (locale: string) {
  return locale === "ka" ? "font-bpgNino" : "font-arial"
}

export const monthOrder: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!
export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL!

export function isLocalStorageAvailable() {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

export const separator = (index: number, array: any, separatorType: string = ', ', separatorEnd: string = ".") => index === array.length - 1 ? separatorEnd : separatorType

export function renderBlocksContentToPdf(
  pdf: jsPDF,
  content: BlocksContent,
  startY: number
): number {
  let y = startY;
  const pageHeight = pdf.internal.pageSize.height;

  const isTextNode = (node: any): node is {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
  } => typeof node.text === "string";

  const extractTextFromChildren = (children: any[]): string => {
    return children.filter(isTextNode).map((child) => child.text).join("");
  };

  const addLine = (text: string, fontStyle = "normal") => {
    if (y > pageHeight - 20) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFont("helvetica", fontStyle);
    pdf.setFontSize(11);
    pdf.text(text, 14, y);
    y += 8;
  };

  content.forEach((block) => {
    switch (block.type) {
      case "heading": {
        const headingText = extractTextFromChildren(block.children);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(headingText, 14, y);
        y += 10;
        break;
      }

      case "paragraph": {
        block.children.forEach((child: any) => {
          if (!isTextNode(child)) return;

          let style: "normal" | "bold" | "italic" | "bolditalic" = "normal";
          if (child.bold) style = "bold";
          if (child.italic) style = style === "bold" ? "bolditalic" : "italic";

          if (child.code) {
            pdf.setFont("courier", "normal");
          } else {
            pdf.setFont("helvetica", style);
          }

          const text = child.text;

          if (child.underline) {
            pdf.setTextColor(0, 0, 255);
            pdf.textWithLink(text, 14, y, { url: "#" });
            pdf.setTextColor(0, 0, 0);
          } else if (child.strikethrough) {
            pdf.text(text, 14, y);
            const width = pdf.getStringUnitWidth(text) * 11 / pdf.internal.scaleFactor;
            pdf.setLineWidth(0.5);
            pdf.line(14, y - 3, 14 + width, y - 3);
          } else {
            pdf.text(text, 14, y);
          }

          y += 8;
        });
        break;
      }

      case "list": {
        const isOrdered = block.format === "ordered";
        block.children.forEach((item: any, i: number) => {
          const bullet = isOrdered ? `${i + 1}.` : "•";
          const line = `${bullet} ${extractTextFromChildren(item.children)}`;
          addLine(line);
        });
        break;
      }

      default:
        break;
    }
  });

  return y;
}

