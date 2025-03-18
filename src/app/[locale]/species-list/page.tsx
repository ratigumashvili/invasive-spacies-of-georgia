import Container from "@/app/[locale]/_components/container";
import { fetchSpeciesData } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string }>
}

export default async function SpeciesList({ params }: Props) {
    const { locale } = await params
    const data = await fetchSpeciesData(locale,)
    return (
        <Container>
            <pre>Species-list: {JSON.stringify(data, null, 2)}</pre>
        </Container>
    )
}