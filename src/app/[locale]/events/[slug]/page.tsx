import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';

import { Separator } from '@/components/ui/separator';
import Container from "@/app/[locale]/_components/container"

import { getEvents } from "@/lib/api-calls"

type Props = {
    params: Promise<{ locale: string, slug: string }>
}

export default async function SingleEventPage({ params }: Props) {

    const { locale, slug } = await params

    const filter = `&filters[$and][0][slug][$eq]=${slug}`

    const events = await getEvents(locale, 1, 1, filter)

    let content: BlocksContent = [];

    if (events?.data[0]?.description) {
        content = events.data[0].description as BlocksContent ?? [];
    }

    return (
        <Container>
            <h1 className='text-2xl font-medium mb-1'>{events?.data[0]?.title}</h1>
            <h2 className='text-muted-foreground text-sm'>
                {events?.data[0]?.location},{" "}
                {events?.data[0]?.endMonth
                    ? `${events?.data[0]?.startDate} ${events?.data[0]?.startMonth} - ${events?.data[0]?.endDate} ${events?.data[0]?.endMonth}`
                    : `${events?.data[0]?.startDate} - ${events?.data[0]?.endDate} ${events?.data[0]?.startMonth}`
                }, {events?.data[0]?.year}

            </h2>
            <Separator className='my-4' />
            <div className='rich-text'>
                <BlocksRenderer content={content} />
            </div>
        </Container>
    )

}