import Container from "@/app/[locale]/_components/container"
import { getEvents } from "@/lib/api-calls"
import qs from "query-string";

export default async function SingleEventPage ({params}: {params: {locale: string, slug: string}}) {

    const {locale, slug} = await params

    const filter = `&filters[$and][0][slug][$eq]=${slug}`

    const events = await getEvents(locale, 1, filter)

    return (
        <Container>
            <pre>
                locale: {JSON.stringify(locale)}
                slug: {JSON.stringify(slug)}
                <br /><br /><br />
                {JSON.stringify(events, null, 2)}
            </pre>
        </Container>
    )

}