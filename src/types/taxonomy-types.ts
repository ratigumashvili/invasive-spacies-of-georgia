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
  lifeForm: string;
  coordinates: string;
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
  lifeForm: string;
  coordinates: string;
  isNew: boolean,
  dateOfDetection: Date,
  image: Image,
  places: Place[],
  habitats: Habitat[],
  kingdom: TaxonomyEntity;
  phylum: TaxonomyEntity;
  class: TaxonomyEntity;
  order: TaxonomyEntity;
  family: TaxonomyEntity;
  genus: TaxonomyEntity;
  localizations: LocalizationEntity[];
}

export interface SpeciesList {
  documentId: string;
  title: string;
  coordinates: string;
  species: SpeciesEntity[];
}

export type SpeciesResponse = StrapiResponse<SpeciesEntity>;
export type SpeciesListResponse = StrapiResponse<SpeciesList>;
