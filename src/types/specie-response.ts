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

export type Species = {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    scientificNameId: string;
    scientificNameUrl: string;
    autorName?: string;
    ecologicalGroup?: string;
    firstIntroduced?: string;
    isNew?: boolean;
    dateOfDetection?: string | null;
    kingdom: TaxonomyEntity;
    phylum: TaxonomyEntity;
    class: TaxonomyEntity;
    order: TaxonomyEntity;
    family: TaxonomyEntity;
    genus: TaxonomyEntity;
    places: Place[],
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
