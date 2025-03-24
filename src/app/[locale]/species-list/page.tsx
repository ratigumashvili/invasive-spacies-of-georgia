import qs from "qs";

import Container from "@/app/[locale]/_components/container";
import { Pagination } from "@/app/[locale]/_components/pagination";
import { SpeciesListClient } from "@/app/[locale]/_components/species-list-client";

import { fetchSpeciesData } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SpeciesList({ params, searchParams }: Props) {
    const { locale } = await params
    const resolvedSearchParams = await searchParams

    const currentPage = Number(resolvedSearchParams.page) || 1
    const kingdom = resolvedSearchParams.kingdom as string

    const capitalizedKingdom = kingdom && kingdom?.charAt(0).toUpperCase() + kingdom.slice(1)

    const queryString = qs.stringify({
        filters: {
          $and: [
            {
              kingdom: {
                name: {
                  $eq: capitalizedKingdom
                }
              }
            }
          ]
        }
      }, { encodeValuesOnly: true });
      

    const response = await fetchSpeciesData(locale, currentPage, 24, queryString)

    return (
        <Container>
            <SpeciesListClient response={response} />
            <Pagination
                currentPage={currentPage}
                totalPages={response?.meta.pagination.pageCount as number}
                pathname={`species-list`}
            />
        </Container>
    )
}