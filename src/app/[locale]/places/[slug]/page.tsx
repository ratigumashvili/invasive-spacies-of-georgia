import Container from "@/app/[locale]/_components/container";
import { SinglePlaceComponent } from "@/app/[locale]/_components/places/single-place";

import { fetchPlacesData } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string, slug: string }>
}

export default async function SinglePlace({ params }: Props) {
    const { locale, slug } = await params

    const filter = `&filters[$and][0][slug][$eq]=${slug}`
    const response = await fetchPlacesData(locale, 1, filter)

    return (
        <Container>
            <SinglePlaceComponent data={response?.data} locale={locale} />
        </Container>
    )
}