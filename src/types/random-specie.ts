import { ImageData } from "./shared-types";
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
    image?: ImageData[]
  };
  