import { ImageData } from "./shared-types";

  export interface HomePageData {
    id: number;
    documentId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    subtitle: string;
    version: string;
    images: ImageData[];
  }
  
  