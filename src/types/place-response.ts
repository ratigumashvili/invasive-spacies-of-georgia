export interface Place {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    coordinates: string;
  }
  
  export interface PaginationMeta {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  }
  
  export interface PlaceResponse {
    data: Place[];
    meta: {
      pagination: PaginationMeta;
    };
  }