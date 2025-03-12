import Container from "@/app/[locale]/_components/container";

type Props = {
    params: Promise<{ slug: string }>
}

export default async function SingleSpecieList ({params}: Props) {
    const {slug} = await params
    return (
        <Container>Single Specie for {JSON.stringify(slug, null, 2)}</Container>
    )
}