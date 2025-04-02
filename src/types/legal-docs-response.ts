interface Date {
    day: number,
    month: number,
    year: number
}

export interface LegalDocs {
    id: number;
    documentId: string;
    title: string;
    documentType: string,
    description: string;
    url: string;
    date: Date
}

export type LegalDocsResponse = {
    data: LegalDocs[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
};