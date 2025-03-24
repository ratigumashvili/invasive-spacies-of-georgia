import { EventItem } from "@/types/event-item";
import { SpeciesListResponse } from "@/types/taxonomy-types";
import axios from "axios";
import qs from "qs";

import { BASE_API_URL, BASE_URL } from "./utils";
import { PlaceResponse } from "@/types/place-response";
import { SpeciesResponse } from "@/types/specie-response";
import { SpeciesCount } from "@/types/species-count";

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

export async function fetchSpeciesData(locale: string, page: number = 1, pageSize: number = 2, filterQuery?: string) {
  try {
    const queryParams = {
      fields: [
        "autorName", "locale", "name", "slug", "lifeForm", "firstRecorded", "isNew", "dateOfDetection", "scientificNameId", "scientificNameUrl"
      ],

      populate: {
        image: {
          fields: ["documentId", "alternativeText", "caption", "width", "height", "url"]
        },
        kingdom: { fields: ["name", "slug"] },
        phylum: { fields: ["name", "slug"] },
        class: { fields: ["name", "slug"] },
        order: { fields: ["name", "slug"] },
        family: { fields: ["name", "slug"] },
        genus: { fields: ["name", "slug"], },
        places: { fields: ["title", "slug", "coordinates"] }
      },
      pagination: {
        page,
        pageSize
      },
      locale,
    };

    const query = `${qs.stringify(queryParams, { encodeValuesOnly: true })}${filterQuery ? `&${filterQuery}` : ''}`;
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

export async function getSpeciesCountByKingdom(locale: string, filters?: string) {
  try {
    const queryParams = {
      status: "published",
      pagination: {
        pageSize: 0,
      },
      locale,
      filters: {
        $and: [
          {
            kingdom: {
              name: {
                $eq: filters
              }
            }
          }
        ]
      }
    }

    const query = qs.stringify(queryParams, { encodeValuesOnly: true, });
    const response = await fetch(`${BASE_API_URL}/species?${query}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch data: ${errorData.error?.message || response.statusText}`);
    }

    const json: SpeciesCount = await response.json();

    return json.meta;
  } catch (error) {
    console.error("Error fetching data:", error);
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

export async function getEvents(locale: string, page: number = 1, pageSize: number = 24, filter?: string | null,
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

      "pagination[page]": page,
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
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize, pageCount: 1, total: 0 } }
    };
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
          "documentId",
          "autorName",
          "locale",
          "name",
          "slug",
          "lifeForm",
          "firstRecorded",
          "isNew",
          "dateOfDetection"
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

export async function getAllSpeciesCount(locale: string, filters?: any) {
  try {
    const queryParams = {
      status: "all",
      pagination: {
        pageSize: 0,
      },
      locale,
      filters
    }

    const query = qs.stringify(queryParams, { encodeValuesOnly: true, });
    const response = await fetch(`${BASE_API_URL}/species?${query}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch data: ${errorData.error?.message || response.statusText}`);
    }

    const json: SpeciesCount = await response.json();

    return json.meta;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function fetchSpeciesCoordinates(locale: string, page: number = 1, pageSize: number = 1000) {
  try {
    const queryParams = {
      fields: ["documentId"],

      populate: {
        places: {
          fields: ["coordinates", "title", "slug"]
        }
      },
      pagination: {
        page: page,
        pageSize: pageSize
      },
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

    const data: SpeciesResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching species data:", error.message);
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } } };
  }
}

export async function fetchPlacesData(locale: string, page: number = 1, pageSize: number = 24) {
  try {
    const queryParams = {
      fields: [
        "title", "slug", "coordinates"
      ],

      populate: {
        species: {
          fields: ["id"]
        }
      },
      pagination: {
        page: page,
        pageSize: pageSize
      },
      locale,
      sort: ["title:asc"]
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

export async function fetchPlacesDataBySlug(locale: string, slug: string) {
  try {
    const queryParams = {
      fields: [
        "title", "slug", "coordinates"
      ],

      locale,
      filters: {
        slug: {
          $eq: slug
        }
      },
      sort: ["title:asc"]
    };

    const query = qs.stringify(queryParams, { encodeValuesOnly: true });
    const requestUrl = `${BASE_API_URL}/places?${query}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch places: ${errorData.error?.message || response.statusText}`);
    }

    const data: PlaceResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching places data:", error.message);
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } } };
  }
}

export async function fetchSpeciesByPlaceId(locale: string, placeId: string, page: number = 1, pageSize: number = 24) {
  try {
    const queryParams = {
      fields: [
        "id",
        "name",
        "slug",
        "autorName",
        "lifeForm",
        "firstRecorded",
        "isNew",
        "dateOfDetection"
      ],
      populate: {
        image: {
          fields: [
            "documentId",
            "alternativeText",
            "caption",
            "width",
            "height",
            "url"
          ]
        },
        family: {
          fields: ["name"]
        },
        genus: {
          fields: ["name"]
        }
      },
      filters: {
        places: {
          id: {
            $eq: placeId
          }
        }
      },
      pagination: {
        page: page,
        pageSize: pageSize
      },
      locale,
      sort: ["name:asc"]
    };
    const query = qs.stringify(queryParams, { encodeValuesOnly: true });
    const requestUrl = `${BASE_API_URL}/species?${query}`;

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

// User authentication & file upload

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_API_URL}/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || "Registration failed");
    }

    return {
      status: "success",
      data: data,
    };
  } catch (error: any) {
    return {
      status: "failed",
      data: error.message
    }
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        identifier: email,
        password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Login failed");
    }

    const data = await response.json();
    return {
      status: "success",
      data: data,
    };
  } catch (error: any) {
    return {
      status: "failed",
      data: error.message,
    };
  }
};

export const uploadFile = async (token: string, file: File) => {
  const formData = new FormData();
  formData.append("files", file);

  const response = await fetch(`${BASE_API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "File upload failed");
  }

  return data[0];
};

export async function createSpecie(token: string, specieData: any, uploadedFileId: number):
  Promise<{ status: "success"; data: any } | { status: "failed"; message: string }> {
  const requestData = {
    data: {
      ...specieData,
      image: uploadedFileId,
    },
  };

  const response = await fetch(`${BASE_API_URL}/species?status=draft`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to create specie");
  }

  return { status: "success", data };
}





























// has to be removed

export async function fetchSpeciesByCoordinates(locale: string, pageSize: number = 25, filter?: string) {
  try {
    const queryParams = {
      fields: [
        "title", "locale", "slug", "coordinates"
      ],

      "populate[species][fields]": [
        "name",
        "slug",
        "lifeForm",
        "autorName",
        "firstRecorded",
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
    return { data: [], meta: { pagination: { page: 1, pageSize: 24, pageCount: 1, total: 0 } } };
  }
}