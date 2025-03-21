export type Species = {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    autorName?: string;
    ecologicalGroup?: string;
    firstIntroduced?: string;
    isNew?: boolean;
    dateOfDetection?: string | null;
    image?: {
      id: number;
      documentId: string;
      alternativeText: string | null;
      caption: string;
      width: number;
      height: number;
      url: string;
    };
  };
  
  export type SpeciesResponse = {
    data: Species[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  };
  