import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

interface StrapiResponse<T> {
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

interface FetchParams {
  page?: number;
  pageSize?: number;
  locale?: string;
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
      pagination: { page: params.page || 1, pageSize: params.pageSize || 25 },
      locale: requestedLocale,
      filters: params.filters || undefined,
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
