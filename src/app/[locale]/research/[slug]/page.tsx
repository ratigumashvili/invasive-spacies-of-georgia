import Container from "@/app/[locale]/_components/container";
import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";

import { fetchResearches } from "@/lib/api-calls";
import { BASE_URL, generateFontByLocale } from "@/lib/utils";
import Image from "next/image";
import { Gallery } from "../../_components/gallery";

type Props = {
    params: Promise<{ locale: string, slug: string }>
}

const PageTitle = ({ locale, title }: { locale: string, title: string }) => {
    return (
        <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium mb-8`}>
            {title}
        </h1>
    )
}

export default async function SingleResearch({ params }: Props) {
    const { locale, slug } = await params

    const filters = `&filters[$and][0][slug][$eq]=${slug}`

    const response = await fetchResearches(locale, 1, 1, filters)

    return (
        <Container>

            <PageTitle locale={locale} title={response?.data[0]?.title} />

            <div className="rich-text">
                <BlocksRenderer content={response?.data[0]?.description as BlocksContent} />
            </div>

            {response?.data[0]?.images.length !== 0 && <Gallery photos={response?.data[0]?.images} />}
            
        </Container>
    )
}