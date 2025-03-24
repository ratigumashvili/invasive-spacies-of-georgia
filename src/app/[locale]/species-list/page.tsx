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

    const response = await fetchSpeciesData(locale, currentPage)

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