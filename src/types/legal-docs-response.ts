interface Date {
    day: number,
    month: number,
    year: number
}

export interface legalDocs {
    id: number;
    documentId: string;
    title: string;
    documentType: string,
    description: string;
    url: string;
    date: Date
}

export type legalDocsResponse = {
    data: legalDocs[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
};