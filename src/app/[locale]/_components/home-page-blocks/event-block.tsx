import { CalendarItem } from "@/app/[locale]/_components/calendar-item";

import { HomePageBlocksProps } from "@/types/home-page-blocks";

import { monthOrder } from "@/lib/utils";

export function EventBlock({ events }: HomePageBlocksProps) {
    return (
        <>
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
                )).slice(0, 2)}
        </>
    )
}