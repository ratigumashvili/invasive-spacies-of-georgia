import Container from "@/app/[locale]/_components/container";
import { fetchSpeciesData } from "@/lib/api-calls";

export default async function Search({ params, searchParams }: { params: { locale: string }, searchParams: Record<string, string | string[] | undefined> }) {
    const { locale } = await params
    const { coordinates } = await searchParams

    const urlCoordinates = Array.isArray(coordinates)
    ? coordinates.map(coord => coord.replace(",", ", "))
    : coordinates?.replace(",", ", ")
    
    const formattedCoordinates = encodeURIComponent(urlCoordinates as string).replace(/%20/g, "%20");

    const speciesByCoordinates = await fetchSpeciesData(locale, 30, `&filters[$and][0][coordinates][$eq]=${formattedCoordinates}`)

    return (
        <Container>
            <pre>
                locale {JSON.stringify(locale, null, 2)}
                <br />
                <pre>{JSON.stringify(speciesByCoordinates, null, 2)}</pre>
            </pre>
        </Container>
    )
}