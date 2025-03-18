import Container from "@/app/[locale]/_components/container";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";
import { fetchSpeciesByCoordinates } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }

export default async function Search({ params, searchParams }: Props) {
    const { locale } = await params
    const resolvedSearchParams = await searchParams;

    const { coordinates } = resolvedSearchParams;

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

    if(Object.keys(resolvedSearchParams).length !== 0 && data.data.length === 0) {
        return <NothingFound />
    }

    return (
        <Container>
            {data && data.data.length !== 0 && (
                <div className="w-full" >
                    {data.data.map((item) => (
                        <div key={item.documentId}>
                            <div>{item.title}</div>
                            <div>{item.coordinates}</div>
                            {item.species.map((specie) => (
                                <div className="flex gap-2 border w-full" key={specie.documentId}>
                                    <div>{specie.name}</div>
                                    <div>{specie.autorName}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
            <pre>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </pre>
            
        </Container>
    )
}