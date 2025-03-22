import Container from "@/app/[locale]/_components/container";
import { SinglePlaceComponent } from "@/app/[locale]/_components/places/single-place";
import { Pagination } from "@/app/[locale]/_components/pagination";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";

import { fetchPlacesDataBySlug, fetchSpeciesByPlaceId } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string, slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SinglePlace({ params, searchParams }: Props) {
    const { locale, slug } = await params
    const resolvedSearchParams = await searchParams
    const currentPage = Number(resolvedSearchParams.page) || 1

    const placeResponse = await fetchPlacesDataBySlug(locale, slug)
    const placeId = placeResponse?.data[0]?.id.toString()

    const speciesResponse = await fetchSpeciesByPlaceId(locale, placeId, currentPage, 24)

    if(placeResponse?.data?.length === 0) {
        return <NothingFound />
    }

    return (
        <Container>
            <SinglePlaceComponent
                place={placeResponse?.data}
                coordinates={placeResponse?.data[0]?.coordinates}
                locale={locale}
                data={speciesResponse.data}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={speciesResponse?.meta.pagination.pageCount as number}
                pathname={`places/${slug}`}
            />
        </Container>
    )
}

