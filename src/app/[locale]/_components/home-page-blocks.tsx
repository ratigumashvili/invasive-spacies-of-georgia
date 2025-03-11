import { CalendarItem } from "@/app/[locale]/_components/calendar-item";

import { EventItem } from "@/types/event-item";

const monthOrder: Record<string, number> = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
};

interface HomePageBlocksProps {
    events: {
      data: EventItem[];
      meta: {
        pagination: {
          page: number;
          pageSize: number;
          pageCount: number;
          total: number;
        };
      };
    } | null;
  }


export async function HomePageBlocks({ events }: HomePageBlocksProps) {

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl">Species Alert</h2>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl">Species Factsheets</h2>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl">Events</h2>
                {events?.data
                    ?.sort((a: any, b: any) => (monthOrder[a.startMonth] || 0) - (monthOrder[b.startMonth] || 0))
                    .map((event) => (
                        <CalendarItem
                            key={event.documentId}
                            id={event.documentId}
                            start={event.startDate}
                            end={event.endDate}
                            startMonth={event.startMonth}
                            year={event.year}
                            title={event.title}
                            location={event.location}
                        />
                    )).slice(0, 3)}
            </div>
        </div>
    )
}