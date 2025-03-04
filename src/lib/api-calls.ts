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
      const queryParams = {
        pagination: { page: params.page || 1, pageSize: params.pageSize || 10 },
        locale: params.locale || "en",
        filters: params.filters || undefined,
        populate: params.populate || "*",
      };
  
      const response = await axios.get<StrapiResponse<T>>(`${BASE_URL}/${contentType}`, { params: queryParams });
  
      if (response.data?.data?.length > 0 || params.locale === "en") {
        return response.data;
      }
  
      console.warn(`No ${contentType} data found in ${params.locale}. Fetching fallback from 'en'.`);
  
      const fallbackResponse = await axios.get<StrapiResponse<T>>(`${BASE_URL}/${contentType}`, {
        params: { ...queryParams, locale: "en" },
      });
  
      return fallbackResponse.data;
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error);
      return null;
    }
  }
  