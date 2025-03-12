import Container from "@/app/[locale]/_components/container";

type Props = {
    params: Promise<{ locale: string }>
}

export default async function TaxonomtPage({params}: Props) {
    const {locale} = await params
    return (
        <Container>
            Taxonomy    
        </Container>
    )
}