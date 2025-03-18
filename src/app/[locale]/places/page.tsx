import Container from "@/app/[locale]/_components/container";
import { PlacesList } from "@/app/[locale]/_components/places/places-list"
import { Pagination } from "@/app/[locale]/_components/pagination";

import { fetchPlacesData } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PlacesPage({ params, searchParams }: Props) {
    const { locale } = await params
    const resolvedSearchParams = await searchParams

    const currentPage = Number(resolvedSearchParams.page) || 1;

    const response = await fetchPlacesData(locale, currentPage)

    return (
        <Container>
            <PlacesList data={response?.data} locale={locale} />
            <Pagination
                currentPage={currentPage} 
                totalPages={response?.meta.pagination.pageCount as number}
                pathname={`places`}
            />
        </Container>
    )
}