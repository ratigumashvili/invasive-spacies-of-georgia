import { StrapiRichText } from "./rich-text-blocks";

export interface TaxonomyEntity {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface Place {
    id: number,
    documentId: string;
    title: string,
    slug: string,
    coordinates: string,
}

export interface Habitat {
    id: number,
    documentId: string,
    code: string,
    name: string,
    description: string,
}

export interface Image {
    id: number;
    documentId: string;
    alternativeText: string | null;
    caption: string;
    width: number;
    height: number;
    url: string;
}

export type Species = {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    scientificNameId: string;
    scientificNameUrl: string;
    autorName?: string;
    lifeForm?: string;
    taxonStatus: string;
    firstRecorded?: string;
    isNew?: boolean;
    dateOfDetection?: string | null;
    riskAssessed: string;
    riskAssessedUrl: string;
    identification: StrapiRichText;
    ecology: StrapiRichText;
    distribution: StrapiRichText,
    invasionHistory: StrapiRichText;
    impact: StrapiRichText;
    wcid: StrapiRichText;
    references: StrapiRichText;
    kingdom: TaxonomyEntity;
    phylum: TaxonomyEntity;
    class: TaxonomyEntity;
    order: TaxonomyEntity;
    family: TaxonomyEntity;
    genus: TaxonomyEntity;
    places: Place[],
    habitats: Habitat[],
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
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
