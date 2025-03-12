import { EventItem } from "@/types/event-item";
import axios from "axios";
import qs from "query-string";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL!

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
      fields: ["documentId", "autorName", "locale", "name", "ecologicalGroup", "coordinates"],

      "populate[kingdom][fields]": ["documentId", "name", "slug"],
      "populate[phylum][fields]": ["documentId", "name", "slug"],
      "populate[class][fields]": ["documentId", "name", "slug"],
      "populate[order][fields]": ["documentId", "name", "slug"],
      "populate[family][fields]": ["documentId", "name", "slug"],
      "populate[genus][fields]": ["documentId", "name", "slug"],
      "populate[image][fields]": ["documentId", "alternativeText", "width", "height", "url"],

      "pagination[pageSize]": pageSize,
      locale,
      filter
    };

    const query = qs.stringify(queryParams, { encode: false });

    const requestUrl = `${BASE_API_URL}/species?${query}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch species: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching species data:", error.message);
    return null;
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

















