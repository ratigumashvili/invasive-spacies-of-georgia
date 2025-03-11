import Container from "@/app/[locale]/_components/container"

export default async function SingleEventPage ({params}: {params: {locale: string, slug: string}}) {

    const {locale, slug} = await params

    return (
        <Container>
            <pre>
                locale: {JSON.stringify(locale)}
                slug: {JSON.stringify(slug)}
            </pre>
        </Container>
    )

}