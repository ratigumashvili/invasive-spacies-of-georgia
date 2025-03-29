import Container from "@/app/[locale]/_components/container";
import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";

import { fetchResearches } from "@/lib/api-calls";
import { BASE_URL, generateFontByLocale } from "@/lib/utils";
import Image from "next/image";

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

            <div className="flex gap-2 mt-6 w-full overflow-x-auto">
                {response?.data[0]?.images.length !== 0 && response.data[0]?.images.map((image) => (
                    <div key={image.id} className="w-[200px] h-[200px]">
                        <Image
                            src={`${BASE_URL}${image.url}`}
                            alt="Research"
                            width={200}
                            height={200}
                        />
                        <small className="block mt-2 text-center">{image?.caption}</small>
                    </div>
                ))}
            </div>
        </Container>
    )
}