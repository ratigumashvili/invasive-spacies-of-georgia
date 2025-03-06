import axios from "axios";
import qs from "query-string";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

// interface StrapiResponse<T> {
//   data: T[];
//   meta: {
//     pagination: {
//       page: number;
//       pageSize: number;
//       pageCount: number;
//       total: number;
//     };
//   };
// }

// interface FetchParams {
//   page?: number;
//   pageSize?: number;
//   locale?: string;
//   filters?: Record<string, any>;
//   populate?: string | string[];
// }

// export async function fetchStrapiData<T>(
//   contentType: string,
//   params: FetchParams = {}
// ): Promise<StrapiResponse<T> | null> {
//   try {
//     const requestedLocale = params.locale || "en";
//     const fallbackLocale = requestedLocale === "en" ? "ka" : "en";

//     const queryParams = {
//       pagination: { page: params.page || 1, pageSize: params.pageSize || 25 },
//       locale: requestedLocale,
//       filters: params.filters || undefined,
//       populate: params.populate || "*",
//     };

//     const response = await axios.get<StrapiResponse<T>>(`${BASE_URL}/${contentType}`, { params: queryParams });

//     if (response.data?.data?.length > 0) {
//       return response.data;
//     }

//     console.warn(`No ${contentType} data found in ${requestedLocale}. Fetching fallback from '${fallbackLocale}'.`);

//     const fallbackResponse = await axios.get<StrapiResponse<T>>(`${BASE_URL}/${contentType}`, {
//       params: { ...queryParams, locale: fallbackLocale },
//     });

//     if (fallbackResponse.data?.data?.length > 0) {
//       return fallbackResponse.data;
//     }

//     console.warn(`No ${contentType} data found in both ${requestedLocale} and ${fallbackLocale}. Fetching from ANY available locale.`);

//     const anyLocaleResponse = await axios.get<StrapiResponse<T>>(`${BASE_URL}/${contentType}`, {
//       params: { ...queryParams, locale: undefined },
//     });

//     if (anyLocaleResponse.data?.data?.length > 0) {
//       return anyLocaleResponse.data;
//     }

//     console.warn(`No ${contentType} data found in any locale.`);
//     return null;
//   } catch (error) {
//     console.error(`Error fetching ${contentType}:`, error);
//     return null;
//   }
// }



interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
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

    const response = await axios.get<StrapiResponse<T>>(`${BASE_URL}/${contentType}`, { params: queryParams });

    if (response.data?.data?.length > 0) {
      return response.data;
    }

    console.warn(`No ${contentType} data found in ${requestedLocale}. Fetching fallback from '${fallbackLocale}'.`);

    const fallbackResponse = await axios.get<StrapiResponse<T>>(`${BASE_URL}/${contentType}`, {
      params: { ...queryParams, locale: fallbackLocale },
    });

    if (fallbackResponse.data?.data?.length > 0) {
      return fallbackResponse.data;
    }

    console.warn(`No ${contentType} data found in both ${requestedLocale} and ${fallbackLocale}. Fetching from ANY available locale.`);

    const anyLocaleResponse = await axios.get<StrapiResponse<T>>(`${BASE_URL}/${contentType}`, {
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


export async function fetchSpeciesData(locale: string, pageSize: number = 25) {
  try {
    const queryParams = {
      fields: ["documentId", "autorName", "locale", "name", "ecologicalGroup", "coordinates"],

      "populate[kingdom][fields]": ["documentId", "name", "slug"],
      "populate[phylum][fields]": ["documentId", "name", "slug"],
      "populate[class][fields]": ["documentId", "name", "slug"],
      "populate[order][fields]": ["documentId", "name", "slug"],
      "populate[family][fields]": ["documentId", "name", "slug"],
      "populate[genus][fields]": ["documentId", "name", "slug"],

      "pagination[pageSize]": pageSize,
      locale
    };

    const query = qs.stringify(queryParams, { encode: false });

    const requestUrl = `${BASE_URL}/species?${query}`;

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









