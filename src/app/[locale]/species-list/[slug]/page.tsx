import Container from "@/app/[locale]/_components/container";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";

import { fetchSpeciesData } from "@/lib/api-calls";

type Props = {
    params: Promise<{ slug: string, locale: string }>
}

export default async function SingleSpecieList({ params }: Props) {
    const { slug, locale } = await params

    const filter = `&filters[$and][0][slug][$eq]=${slug}`

    const { data } = await fetchSpeciesData(locale, 1, filter)

    if(data.length === 0) return <NothingFound />

    return (
        <Container>
            <h1>{data[0]?.name}</h1>
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </Container>
    )
}