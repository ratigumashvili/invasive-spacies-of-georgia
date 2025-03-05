export interface StrapiResponse<T> {
    data: T[];
    meta: {
      pagination?: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }
  
  export interface TaxonomyTypes {
    id: string;
    documentId: string;
    name: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    slug: string;
    rank: {
        id: number,
        rank: string
    }
  }
  
  export type TaxonomyAPIResponse = StrapiResponse<TaxonomyTypes>;
  