export interface EventItem {
    id: string;
    slug: string,
    documentId: string;
    title: string;
    location: string;
    year: number;
    startDate: number;
    endDate?: number;
    startMonth: string;
    endMonth?: string;
    content?: string
  }
  