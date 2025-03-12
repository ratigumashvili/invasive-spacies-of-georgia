import Container from "@/app/[locale]/_components/container";
import { fetchSpeciesData } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }

export default async function Search({ params, searchParams }: Props) {
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