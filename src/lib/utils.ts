import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jsPDF } from "jspdf";
import { Species } from "@/types/specie-response";

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

export function generateTextBasedPdf(data: Species) {
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text(`${data.name} (${data.autorName})`, 14, 20);

  pdf.setFontSize(14);
  pdf.text("Taxonomy", 14, 30);

  const taxonomy: [string, string | undefined][] = [
    ["Kingdom", data.kingdom?.name],
    ["Phylum", data.phylum?.name],
    ["Class", data.class?.name],
    ["Order", data.order?.name],
    ["Family", data.family?.name],
    ["Genus", data.genus?.name],
    ["Scientific Name", data.name],
    ["Author Name", data.autorName],
  ];

  let y = 40;
  taxonomy.forEach(([label, value]) => {
    pdf.setFontSize(11);
    pdf.text(`${label}:`, 14, y);
    pdf.text(value || "-", 60, y);
    y += 8;
  });

  pdf.setFontSize(14);
  pdf.text("Metadata", 14, y + 6);
  y += 14;

  const metadata: [string, string | number | null | undefined][] = [
    ["Taxon ID", data.scientificNameId],
    ["Habitat Types", data.habitats?.map((h) => `${h.code} - ${h.name}`).join(", ")],
    ["Ecological Group", data.lifeForm],
    ["Status", data.taxonStatus],
    ["Risk Assessed", data.riskAssessed],
    ["First Introduced", data.firstRecorded],
    ["Number of Records", data.places?.length],
  ];

  metadata.forEach(([label, value]) => {
    pdf.setFontSize(11);
    pdf.text(`${label}:`, 14, y);
    pdf.text(value?.toString() || "-", 60, y);
    y += 8;
  });

  pdf.save(`${data.name || "species-details"}.pdf`);
}