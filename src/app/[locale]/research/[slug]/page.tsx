import Container from "@/app/[locale]/_components/container";
import { Gallery } from "@/app/[locale]/_components/gallery";
import MarkDownContent from "@/app/[locale]/_components/markdown-content";

import { fetchResearches } from "@/lib/api-calls";
import { generateFontByLocale } from "@/lib/utils";

type Props = {
    params: Promise<{ locale: string, slug: string }>
}

const PageTitle = ({ locale, title }: { locale: string, title: string }) => {
    return (
        <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase mb-8`}>
            {title}
        </h1>
    )
}

export default async function SingleResearch({ params }: Props) {
    const { locale, slug } = await params

    const filters = {
        $and: [
            {
                slug: {
                    $eq: slug
                }
            }
        ]
    };

    const response = await fetchResearches(locale, 1, 1, filters)

    return (
        <Container>
            <PageTitle locale={locale} title={response?.data[0]?.title} />
            <MarkDownContent markdown={response?.data[0]?.content} />
            {response?.data[0]?.images.length !== 0 &&
                <Gallery photos={response?.data[0]?.images} className="grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6" />
            }
        </Container>
    )
}