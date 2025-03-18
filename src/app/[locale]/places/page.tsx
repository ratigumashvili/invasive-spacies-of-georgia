import Container from "@/app/[locale]/_components/container";
import { PlacesList } from "@/app/[locale]/_components/places/places-list"

import { fetchPlacesData } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PlacesPage({ params }: Props) {
    const { locale } = await params

    const response = await fetchPlacesData(locale)

    return (
        <Container>
            <PlacesList data={response?.data} locale={locale} />
            pagination
        </Container>
    )
}