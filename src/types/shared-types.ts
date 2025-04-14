export interface PaginationMeta {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  }
  
  export interface StrapiResponse<T> {
    data: T[];
    meta: {
      pagination: PaginationMeta;
    };
  }
  
  export interface FetchParams {
    page?: number;
    pageSize?: number;
    locale?: string;
    slug?: string;
    filters?: Record<string, any>;
    populate?: string | string[];
  }

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