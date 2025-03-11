import Container from "@/app/[locale]/_components/container";

import { getEvents } from "@/lib/api-calls";

export default async function EvensPage({params}: {params: {locale: string}}) {
    const {locale} = await params;

    const events = await getEvents(locale)

    return (
        <Container>
            <pre>
                {JSON.stringify(events, null, 3)}
            </pre>
        </Container>
    )
}