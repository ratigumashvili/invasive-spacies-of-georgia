import { Image } from "./random-specie";

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
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

export interface LocalizationEntity {
  id: number;
  documentId: string;
  autorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  name: string;
  ecologicalGroup: string;
  coordinates: string;
}

export interface Place {
  id: number,
  documentId: string;
  title: string,
  slug: string,
  coordinates: string,
}

export interface SpeciesEntity {
  id: number;
  documentId: string;
  autorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  name: string;
  slug: string,
  ecologicalGroup: string;
  coordinates: string;
  firstIntroduced: number,
  isNew: boolean,
  dateOfDetection: Date,
  image: Image,
  places: Place[],
  kingdom: TaxonomyEntity;
  phylum: TaxonomyEntity;
  class: TaxonomyEntity;
  order: TaxonomyEntity;
  family: TaxonomyEntity;
  genus: TaxonomyEntity;
  localizations: LocalizationEntity[];
}

export type SpeciesResponse = StrapiResponse<SpeciesEntity>;
