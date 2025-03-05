import Container from "@/app/[locale]/_components/container";

export default async function TaxonomtPage({params}: {params: {locale: string}}) {
    const {locale} = await params
    return (
        <Container>
            Taxonomy    
        </Container>
    )
}