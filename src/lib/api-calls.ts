import { EventItem } from "@/types/event-item";
import { SpeciesListResponse, SpeciesResponse } from "@/types/taxonomy-types";
import axios from "axios";
import qs from "query-string";

import { BASE_API_URL } from "./utils";

interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: PaginationMeta;
  };
}

interface FetchParams {
  page?: number;
  pageSize?: number;
  locale?: string;
  slug?: string;
  filters?: Record<string, any>;
  populate?: string | string[];
}

export async function fetchStrapiData<T>(
  contentType: string,
  params: FetchParams = {}
): Promise<StrapiResponse<T> | null> {
  try {
    const requestedLocale = params.locale || "en";
    const fallbackLocale = requestedLocale === "en" ? "ka" : "en";

    const queryParams = {
      pagination: params.slug ? undefined : { page: params.page || 1, pageSize: params.pageSize || 25 },
      locale: requestedLocale,
      filters: params.slug ? { slug: params.slug } : params.filters,
      populate: params.populate || "*",
    };

    const response = await axios.get<StrapiResponse<T>>(`${BASE_API_URL}/${contentType}`, { params: queryParams });

    if (response.data?.data?.length > 0) {
      return response.data;
    }

    console.warn(`No ${contentType} data found in ${requestedLocale}. Fetching fallback from '${fallbackLocale}'.`);

    const fallbackResponse = await axios.get<StrapiResponse<T>>(`${BASE_API_URL}/${contentType}`, {
      params: { ...queryParams, locale: fallbackLocale },
    });

    if (fallbackResponse.data?.data?.length > 0) {
      return fallbackResponse.data;
    }

    console.warn(`No ${contentType} data found in both ${requestedLocale} and ${fallbackLocale}. Fetching from ANY available locale.`);

    const anyLocaleResponse = await axios.get<StrapiResponse<T>>(`${BASE_API_URL}/${contentType}`, {
      params: { ...queryParams, locale: undefined },
    });

    if (anyLocaleResponse.data?.data?.length > 0) {
      return anyLocaleResponse.data;
    }

    console.warn(`No ${contentType} data found in any locale.`);
    return null;
  } catch (error) {
    console.error(`Error fetching ${contentType}:`, error);
    return null;
  }
}

export async function fetchSpeciesData(locale: string, pageSize: number = 25, filter?: string) {
  try {
    const queryParams = {
      fields: [
        "autorName", "locale", "name", "ecologicalGroup", "firstIntroduced", "isNew", "dateOfDetection"
      ],

      "populate[image][fields]": ["documentId", "alternativeText", "caption", "width", "height", "url"],

      "populate[kingdom][fields]": ["name", "slug"],
      "populate[phylum][fields]": ["name", "slug"],
      "populate[class][fields]": ["name", "slug"],
      "populate[order][fields]": ["name", "slug"],
      "populate[family][fields]": ["name", "slug"],
      "populate[genus][fields]": ["name", "slug"],
      "populate[places][fields]": ["title", "slug", "coordinates"],

      "pagination[pageSize]": pageSize,
      locale,
      filter
    };

    const query = qs.stringify(queryParams, { encode: false });
    const requestUrl = `${BASE_API_URL}/species?${query}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch species: ${errorData.error?.message || response.statusText}`);
    }

    const data: SpeciesResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching species data:", error.message);
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } } };
  }
}

export const getSinglePage = async <T>(
  path: string,
  locale: string,
  params?: string
): Promise<T> => {
  try {
    const response = await axios.get<StrapiResponse<T>>(
      `${BASE_API_URL}/${path}?locale=${locale}&${params}`
    );

    return response.data.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "API request failed");
    }
    throw new Error("Unexpected error occurred");
  }
};

export async function getEvents(
  locale: string,
  pageSize: number = 25,
  filter?: string | null,
): Promise<StrapiResponse<EventItem> | null> {
  try {
    const queryParams = {
      fields: [
        "slug",
        "documentId",
        "title",
        "location",
        "description",
        "year",
        "startDate",
        "endDate",
        "startMonth",
        "endMonth"
      ],
      "pagination[pageSize]": pageSize,
      locale,
      filter,
    };

    const query = qs.stringify(queryParams, { encode: false });

    const requestUrl = `${BASE_API_URL}/events?${query}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch events: ${errorData.error?.message || response.statusText}`);
    }

    const data: StrapiResponse<EventItem> = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching events data:", error.message);
    return null;
  }
}

export async function fetchRandomSpecie(locale: string, filterType?: "isNew" | "notNew") {
  try {
    const countQuery = qs.stringify({
      "filters[image][url][$ne]": null,
      locale
    });

    const countResponse = await fetch(`${BASE_API_URL}/species?${countQuery}`);
    const countData = await countResponse.json();
    const totalSpecies = countData.meta?.pagination?.total || 1;

    if (totalSpecies === 0) {
      throw new Error("No species found");
    }

    let validSpecies = null;

    while (!validSpecies) {
      const randomPage = Math.floor(Math.random() * totalSpecies) + 1;

      const queryParams = {
        fields: [
          "documentId", "autorName", "locale", "name", "slug",
          "ecologicalGroup", "firstIntroduced", "isNew", "dateOfDetection"
        ],
        "populate[image][fields]": ["documentId", "alternativeText", "caption", "width", "height", "url"],

        "filters[image][url][$ne]": null,
        "pagination[pageSize]": 1,
        "pagination[page]": randomPage,
        locale
      };

      const query = qs.stringify(queryParams, { encode: false });
      const requestUrl = `${BASE_API_URL}/species?${query}`;

      const response = await fetch(requestUrl, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch species: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      if (data.data.length > 0) {
        const randomSpecie = data.data[0];

        if (
          (filterType === "isNew" && randomSpecie.isNew) ||
          (filterType === "notNew" && !randomSpecie.isNew) ||
          !filterType
        ) {
          validSpecies = randomSpecie;
        }
      }
    }

    return validSpecies;
  } catch (error: any) {
    console.error("Error fetching species data:", error.message);
    return null;
  }
}

export async function fetchSpeciesCoordinates(locale: string, pageSize: number = 25, filter?: string) {
  try {
    const queryParams = {
      fields: ["documentId"],
      "populate[places][fields]": ["coordinates", "title", "slug"],
      "pagination[pageSize]": pageSize,
      locale,
      filter
    };

    const query = qs.stringify(queryParams, { encode: false });
    const requestUrl = `${BASE_API_URL}/species?${query}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch species: ${errorData.error?.message || response.statusText}`);
    }

    const data: SpeciesResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching species data:", error.message);
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } } };
  }
}

export async function fetchSpeciesByCoordinates(locale: string, pageSize: number = 25, filter?: string) {
  try {
    const queryParams = {
      fields: [
        "title", "locale", "slug", "coordinates"
      ],

      "populate[species][fields]": [
        "name", 
        "slug", 
        "ecologicalGroup", 
        "autorName", 
        "firstIntroduced",
        "isNew",
        "dateOfDetection",
      ],

      "populate[species][populate][family][fields]": [
        "name",
        "slug",
      ],

      "populate[species][populate][genus][fields]": [
        "name",
        "slug"
      ],

      "pagination[pageSize]": pageSize,
      locale,
      filter
    };

    const query = qs.stringify(queryParams, { encode: false });
    const requestUrl = `${BASE_API_URL}/places?${query}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch species: ${errorData.error?.message || response.statusText}`);
    }

    const data: SpeciesListResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching species data:", error.message);
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } } };
  }
}

export async function fetchPlacesData(locale: string, pageSize: number = 25, filter?: string) {
  try {
    const queryParams = {
      fields: [
        "title", "slug", "coordinates"
      ],

      "populate[species][fields]": [
        "id",
        "name",
        "slug",
        "autorName",
        "ecologicalGroup",
        "firstIntroduced",
        "isNew",
        "dateOfDetection"
      ],

      "populate[species][populate][image][fields]": [
        "documentId", 
        "alternativeText", 
        "caption", 
        "width", 
        "height", 
        "url"
      ],

      "pagination[pageSize]": pageSize,
      locale,
      filter,

      "sort": "title:asc"
    };

    const query = qs.stringify(queryParams, { encode: false });
    const requestUrl = `${BASE_API_URL}/places?${query}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch places: ${errorData.error?.message || response.statusText}`);
    }

    const data: SpeciesResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching places data:", error.message);
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } } };
  }
}




