import { StrapiRichText } from "./rich-text-blocks";
import { Image } from "./specie-response";

export interface Research {
    id: number;
    documentId: string;
    title: string;
    slug: string,
    content: string;
    images: Image[]
}

export type ResearchResponse = {
    data: Research[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
};