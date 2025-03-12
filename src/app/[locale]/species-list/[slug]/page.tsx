import Container from "@/app/[locale]/_components/container";

export default async function SingleSpecie ({params}: {params: {slug: string, locale: string}}) {
    const {slug, locale} = await params
    return (
        <Container>Single Specie for {JSON.stringify(slug, null, 2)}</Container>
    )
}