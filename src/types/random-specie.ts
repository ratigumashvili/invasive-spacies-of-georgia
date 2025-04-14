import { DetectionDate } from "./specie-response";

export type SingleSpecieList = {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    locale: string;
    autorName?: string;
    lifeForm?: string;
    isNew?: boolean;
    detectionDate?: DetectionDate[];
    image?: {
      id: number;
      documentId: string;
      alternativeText: string | null;
      caption: string;
      width: number;
      height: number;
      url: string;
    }[];
  };
  

export interface Image {
    id: number,
    documentId: string,
    alternativeText?: string | null,
    caption?: string,
    width: number,
    height: number,
    url: string
}