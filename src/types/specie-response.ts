import { StrapiRichText } from "./rich-text-blocks";

export type SpeciesCoordinate = {
    specieName: string;
    placeName: string;
    slug: string;
    coordinates: [number, number];
  };
  

export interface SpecieDownload {
    kingdom: string,
    phylum: string,
    class: string,
    order: string,
    family: string,
    genus: string,
    scientific_name: string,
    scientific_name_authorship: string | undefined,
    taxonId: string,
    taxonId_url: string,
    habitatType: string[],
    ecologicalGroup: string | undefined,
    status: string,
    riskAssessed: string,
    riskAssessedUrl: string,
    firstRecordInGeorgia: string | undefined,
    detectionDate?: DetectionDate[];
    recordNumber: number,
    identification: string,
    ecology: string,
    distribution: string,
    invasionHistory: string,
    impact: string,
    whatCanIDo: string,
    references: string,
}

export interface DistributionDownload {
    place: string,
    lat: string,
    lng: string
}

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

export interface User {
    id: number,
    username: string,
    email: string
}

export interface DetectionDate {
    id: number,
    year: number,
    month: number,
    day: number
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
    isNew?: boolean;
    riskAssessed: string;
    riskAssessedUrl: string;
    // identification: StrapiRichText;
    // ecology: StrapiRichText;
    // distribution: StrapiRichText,
    // invasionHistory: StrapiRichText;
    // impact: StrapiRichText;
    // wcid: StrapiRichText;
    // references: StrapiRichText

    identification: string;
    ecology: string;
    distribution: string,
    invasionHistory: string;
    impact: string;
    wcid: string;
    references: string;
    kingdom: TaxonomyEntity;
    phylum: TaxonomyEntity;
    class: TaxonomyEntity;
    order: TaxonomyEntity;
    family: TaxonomyEntity;
    genus: TaxonomyEntity;
    places: Place[];
    habitats: Habitat[];
    authors: User[];
    detectionDate: DetectionDate[];
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
    }[];
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
