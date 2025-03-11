import { StrapiRichText } from "./rich-text-blocks";

export interface EventItem {
    id: number;
    documentId: string;
    title: string;
    location: string;
    description: StrapiRichText;
    year: number;
    startDate: number;
    endDate?: number;
    startMonth: string;
    endMonth?: string;
  }