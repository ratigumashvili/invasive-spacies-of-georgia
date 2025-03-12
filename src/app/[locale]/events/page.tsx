import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { EventBlock } from "@/app/[locale]/_components/home-page-blocks/event-block";

import { getEvents } from "@/lib/api-calls";
import { generateFontByLocale } from "@/lib/utils";

const PageTitle = ({ locale }: { locale: string }) => {
    const t = useTranslations("Common")
    return (
        <h1 className={`${generateFontByLocale(locale)} text-2xl font-medium mb-8`}>
            {t("upcomming_events")}
        </h1>
    )
}

type Props = {
    params: Promise<{ locale: string }>
  }

export default async function EvensPage({ params }: Props) {
    const { locale } = await params;

    const events = await getEvents(locale)

    return (
        <Container>
            <PageTitle locale={locale} />
            <EventBlock events={events} />
        </Container>
    )
}