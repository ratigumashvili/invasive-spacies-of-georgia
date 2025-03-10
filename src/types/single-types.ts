export interface ImageData {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    url: string;
  }

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
  
  