import axios from "axios";
import qs from "qs";

import { BASE_API_URL, BASE_URL } from "./utils";

import { EventItem } from "@/types/event-item";
import { SpeciesListResponse, StrapiResponse } from "@/types/taxonomy-types";
import { PlaceResponse } from "@/types/place-response";
import { SpeciesCoordinate, SpeciesResponse } from "@/types/specie-response";
import { SpeciesCount } from "@/types/species-count";
import { ResearchResponse } from "@/types/research-response";
import { LegalDocsResponse } from "@/types/legal-docs-response";
import { FetchParams } from "@/types/shared-types";

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
        "autorName",
        "locale",
        "name",
        "slug",
        "lifeForm",
        "isNew",
        "scientificNameId",
        "scientificNameUrl",
        "taxonStatus",
        "riskAssessed",
        "riskAssessedUrl",
        "identification",
        "ecology",
        "distribution",
        "invasionHistory",
        "impact",
        "wcid",
        "references"
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
        places: { fields: ["title", "slug", "coordinates"] },
        habitats: { fields: ["code", "name", "description"] },
        authors: { fields: ["username", "email"] },
        detectionDate: {
          sort: ['year:desc', 'month:desc', 'day:desc']
        },
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

export async function getEvents(locale: string, page: number = 1, pageSize: number = 24, filters?: Record<string, any>,
): Promise<StrapiResponse<EventItem> | null> {
  try {
    const queryParams = {

      fields: [
        "slug",
        "documentId",
        "title",
        "location",
        "year",
        "startDate",
        "endDate",
        "startMonth",
        "endMonth",
        "content"
      ],

      pagination: {
        page: page,
        pageSize: pageSize
      },
      locale,
      filters,
    };

    const query = qs.stringify(queryParams, { encodeValuesOnly: true });

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

export async function fetchResearches(locale: string, page: number = 1, pageSize: number = 1, filterQuery?: Record<string, any>) {
  try {

    const queryParams = {
      fields: ["title", "slug", "content"],
      populate: {
        images: {
          fields: ["id", "alternativeText", "caption", "url", "width", "height"]
        }
      },
      pagination: {
        page,
        pageSize
      },
      locale,
      sort: ["title:asc"],
      filters: filterQuery || undefined,
    };

    const query = qs.stringify(queryParams, { encodeValuesOnly: true });
    const requestUrl = `${BASE_API_URL}/researches?${query}`;


    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch researches: ${errorData.error?.message || response.statusText}`);
    }

    const data: ResearchResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching research data:", error.message);
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } } };
  }
}

export async function fetchLegalDocs(locale: string, page: number = 1, pageSize: number = 1) {
  try {
    const queryParams = {
      fields: [
        "title", "documentType", "description", "url"
      ],

      populate: {
        date: {
          fields: ["day", "month", "year"]
        }
      },
      pagination: {
        page: page,
        pageSize: pageSize
      },
      locale,
    };

    const query = qs.stringify(queryParams, { encode: false });
    const requestUrl = `${BASE_API_URL}/legal-docs?${query}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch legal-docs: ${errorData.error?.message || response.statusText}`);
    }

    const data: LegalDocsResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching legal-docs data:", error.message);
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } } };
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
          "locale",
          "name",
          "slug",
          "isNew",
        ],

        populate: {
          image: {
            fields: ["documentId", "alternativeText", "caption", "width", "height", "url"]
          }
        },

        filters: {
          image: {
            url: {
              $ne: null
            }
          }
        },

        pagination: {
          pageSize: 1,
          page: randomPage
        },

        locale
      };

      const query = qs.stringify(queryParams, { encodeValuesOnly: true });
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

// export async function fetchAllSpeciesCoordinates(locale: string): Promise<any[]> {
//   let page = 1;
//   const pageSize = 100;
//   let allData: any[] = [];
//   let totalPages = 1;

//   do {
//     const queryParams = {
//       locale,
//       pagination: {
//         page,
//         pageSize,
//       },
//       populate: {
//         places: {
//           fields: ['coordinates', 'title', 'slug'],
//         },
//       },
//       fields: ['documentId'],
//     };

//     const query = qs.stringify(queryParams, { encodeValuesOnly: true });
//     const response = await fetch(`${BASE_API_URL}/species?${query}`, {
//       headers: { Accept: 'application/json' },
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(`Error fetching coordinates: ${error.error?.message}`);
//     }

//     const result = await response.json();
//     allData.push(...result.data);
//     totalPages = result.meta.pagination.pageCount;
//     page++;
//   } while (page <= totalPages);

//   return allData;
// }

export async function fetchAllSpeciesCoordinates(locale: string): Promise<SpeciesCoordinate[]> {
  let page = 1;
  const pageSize = 100;
  let allData: SpeciesCoordinate[] = [];
  let totalPages = 1;

  do {
    const queryParams = {
      locale,
      pagination: {
        page,
        pageSize,
      },
      populate: {
        places: {
          fields: ['coordinates', 'title', 'slug'],
        },
      },
      fields: ['documentId', 'name'], // 👈 also fetch specie name
    };

    const query = qs.stringify(queryParams, { encodeValuesOnly: true });
    const response = await fetch(`${BASE_API_URL}/species?${query}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error fetching coordinates: ${error.error?.message}`);
    }

    const result = await response.json();

    const speciesList = result.data;

    const flattenedCoordinates: SpeciesCoordinate[] = speciesList.flatMap((specie: any) => {
      const specieName = specie.name ?? "Unknown Specie";
    
      return specie?.places?.map((place: any) => ({
        specieName,
        placeName: place.title ?? "Unknown Place",
        slug: place.slug,
        coordinates: place.coordinates?.split(',').map(Number) as [number, number],
      })) ?? [];
    });
    

    allData.push(...flattenedCoordinates);

    totalPages = result.meta.pagination.pageCount;
    page++;
  } while (page <= totalPages);

  return allData;
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
        "isNew",
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
        detectionDate: {
          sort: ['year:desc', 'month:desc', 'day:desc']
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

// Search

export async function searchSpecieByType(locale: string, type: string, name: string, page: number = 1, pageSize: number = 1) {
  try {
    const dynamicFilter = {
      [type]: {
        name: {
          $contains: name,
        },
      },
    };

    const queryParams = {
      fields: ["name", "slug", "autorName", "lifeForm"],
      populate: {
        family: {
          fields: ["name", "slug"]
        },
        genus: {
          fields: ["name", "slug"]
        }
      },
      locale,
      filters: {
        $and: [dynamicFilter],
      },
      pagination: {
        page,
        pageSize
      },
      sort: ["name:asc"],
    };

    const query = qs.stringify(queryParams, { encodeValuesOnly: true });
    const requestUrl = `${BASE_API_URL}/species?${query}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch species: ${errorData.error?.message || response.statusText}`);
    }

    const data: SpeciesResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching species data:", error.message);
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } },
    };
  }
}

export async function searchSpecieByName(locale: string, name: string, page: number = 1, pageSize: number = 1) {
  try {
    const queryParams = {
      fields: ["name", "slug", "autorName", "lifeForm"],
      populate: {
        family: {
          fields: ["name", "slug"]
        },
        genus: {
          fields: ["name", "slug"]
        }
      },
      locale,
      filters: {
        $and: [
          {
            name: {
              $contains: name
            }
          }
        ],
      },
      pagination: {
        page,
        pageSize
      },
      sort: ["name:asc"],
    };

    const query = qs.stringify(queryParams, { encodeValuesOnly: true });
    const requestUrl = `${BASE_API_URL}/species?${query}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch species: ${errorData.error?.message || response.statusText}`);
    }

    const data: SpeciesResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching species data:", error.message);
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } },
    };
  }
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
        "isNew",
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