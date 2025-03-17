import Container from "@/app/[locale]/_components/container";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";
import { fetchSpeciesByCoordinates } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }

export default async function Search({ params, searchParams }: Props) {
    const { locale } = await params
    const { coordinates } = await searchParams

    const formatCoordinates = (coords?: string | string[]) => {
        if (!coords) return "";
    
        if (Array.isArray(coords)) {
            return coords
                .map(coord => coord.replace(/\s*,\s*/g, ",%20"))
                .join(",");
        }
    
        return coords.replace(/\s*,\s*/g, ",%20");
    };
    
    const formattedCoordinates = formatCoordinates(coordinates);

    const filter = `&filters[$and][0][coordinates][$eq]=${formattedCoordinates}`

    const data = await fetchSpeciesByCoordinates(locale, 25, filter)

    if(Object.keys(searchParams).length !== 0 && data.data.length === 0) {
        return <NothingFound />
    }

    return (
        <Container>
            <pre>
                searchParams {JSON.stringify(searchParams, null, 2)}
                <br />
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </pre>
            
        </Container>
    )
}