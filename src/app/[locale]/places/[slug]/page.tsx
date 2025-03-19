import Container from "@/app/[locale]/_components/container";
import { SinglePlaceComponent } from "@/app/[locale]/_components/places/single-place";
import { Pagination } from "@/app/[locale]/_components/pagination";

import { fetchPlacesData } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string, slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SinglePlace({ params, searchParams }: Props) {
    const { locale, slug } = await params
    const resolvedSearchParams = await searchParams
    const currentPage = Number(resolvedSearchParams.page) || 1

    const filter = `&filters[$and][0][slug][$eq]=${slug}`
    const response = await fetchPlacesData(locale, 1, 1, filter)

    return (
        <Container>
            <SinglePlaceComponent data={response?.data} locale={locale} />
            <Pagination
                currentPage={currentPage}
                totalPages={response?.meta.pagination.pageCount as number}
                pathname={`places/${slug}`}
            />
        </Container>
    )
}