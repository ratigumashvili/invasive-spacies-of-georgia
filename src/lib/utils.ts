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
  const lineHeight = 8;
  const marginLeft = 14;
  const contentWidth = 180;

  const checkPageOverflow = (additionalHeight = lineHeight) => {
    if (y + additionalHeight > pageHeight - 20) {
      pdf.addPage();
      y = 20;
    }
  };

  const addWrappedText = (
    text: string,
    options?: { fontStyle?: "normal" | "bold" | "italic"; link?: string }
  ) => {
    const { fontStyle = "normal", link } = options || {};
    pdf.setFont("helvetica", fontStyle);
    pdf.setFontSize(11);
    const wrapped = pdf.splitTextToSize(text, contentWidth);

    wrapped.forEach((line: any) => {
      checkPageOverflow();
      if (link) {
        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink(line, marginLeft, y, { url: link });
        pdf.setTextColor(0, 0, 0);
      } else {
        pdf.text(line, marginLeft, y);
      }
      y += lineHeight;
    });
  };

  content.forEach((block: any) => {
    switch (block.type) {
      case "heading": {
        const headingText = block.children
          .map((c: any) => c.text ?? "")
          .join("");
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        checkPageOverflow(10);
        pdf.text(headingText, marginLeft, y);
        y += 10;
        break;
      }

      case "paragraph": {
        const lines: string[] = [];

        block.children.forEach((child: any) => {
          if (child.type === "link") {
            const linkText = child.children?.map((c: any) => c.text ?? "").join("") ?? "";
            addWrappedText(linkText, { link: child.url });
          } else {
            addWrappedText(child.text ?? "");
          }
        });

        break;
      }

      case "list": {
        const isOrdered = block.format === "ordered";
        block.children.forEach((item: any, i: number) => {
          const bullet = isOrdered ? `${i + 1}.` : "•";
          const itemText = item.children
            .map((c: any) =>
              c.type === "link"
                ? c.children?.map((sc: any) => sc.text ?? "").join("") ?? ""
                : c.text ?? ""
            )
            .join(" ");
          addWrappedText(`${bullet} ${itemText}`);
        });
        break;
      }

      default:
        break;
    }
  });

  return y;
}


export function strapiRichTextToPlainText(blocks: any[]): string {
  let plainText = "";

  blocks.forEach((block) => {
    if (block.children && Array.isArray(block.children)) {
      block.children.forEach((child: any) => {
        if (child.text) {
          plainText += child.text;
        } else if (child.children) {
          child.children.forEach((nestedChild: any) => {
            if (nestedChild.text) {
              plainText += nestedChild.text;
            }
          });
        }
      });
    }

    if (block.type === "list" && Array.isArray(block.children)) {
      block.children.forEach((item: any) => {
        const itemText = item.children
          ?.map((c: any) => c.text ?? "")
          .join(" ")
          .trim();
        if (itemText) {
          plainText += `- ${itemText}\n`;
        }
      });
    }

    plainText += "\n";
  });

  return plainText.trim();
}

export const exportDataAsCSV = (dataObject: any) => {
  const convertToCSV = (objArray: any) => {
      const array = Array.isArray(objArray) ? objArray : [objArray];
      const headers = Object.keys(array[0]).join(",");
      const rows = array.map(row =>
          Object.values(row)
              .map(value => `"${value}"`)
              .join(",")
      );

      return [headers, ...rows].join("\n");
  };

  const csvString = convertToCSV(dataObject);
  const csvBlob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  const url = URL.createObjectURL(csvBlob);
  link.href = url;
  link.download = "data.csv";

  link.click();

  URL.revokeObjectURL(url);
};