import Container from "@/app/[locale]/_components/container";
import { PlacesList } from "@/app/[locale]/_components/places-list"

import { fetchPlacesData } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string }>
}

export default async function PlacesPage({ params }: Props) {
    const { locale } = await params

    const response = await fetchPlacesData(locale)

    return (
        <Container>
            <PlacesList data={response?.data} />
        </Container>
    )
}