import Container from "@/app/[locale]/_components/container";

type Props = {
    params: Promise<{ locale: string }>
}

export default async function PlacesPage({ params }: Props) {
    const { locale } = await params
    return (
        <Container>
            {JSON.stringify(locale, null, 3)}
        </Container>
    )
}