import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { CalendarItem } from "@/app/[locale]/_components/calendar-item";
import { Pagination } from "@/app/[locale]/_components/pagination";

import { getEvents } from "@/lib/api-calls";

import { generateFontByLocale, monthOrder } from "@/lib/utils";

const PageTitle = ({ locale }: { locale: string }) => {
    const t = useTranslations("Common")
    return (
        <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase mb-8`}>
            {t("upcomming_events")}
        </h1>
    )
}

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EvensPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams

    const currentPage = Number(resolvedSearchParams.page) || 1

    const events = await getEvents(locale, currentPage)

    return (
        <Container>
            <PageTitle locale={locale} />
            {events?.data
                ?.sort((a: any, b: any) => (monthOrder[a.startMonth] || 0) - (monthOrder[b.startMonth] || 0))
                .map((event) => (
                    <CalendarItem
                        key={event.documentId}
                        slug={event.slug}
                        id={event.documentId}
                        documentId={event.documentId}
                        startDate={event.startDate}
                        endDate={event.endDate}
                        startMonth={event.startMonth}
                        year={event.year}
                        title={event.title}
                        location={event.location}
                    />
                ))}
            <Pagination
                currentPage={currentPage}
                totalPages={events?.meta.pagination.pageCount as number}
                pathname={`events`}
            />
        </Container>
    )
}