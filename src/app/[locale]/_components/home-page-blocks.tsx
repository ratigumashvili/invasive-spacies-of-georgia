import { Link } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { CalendarItem } from "@/app/[locale]/_components/calendar-item";

import { EventItem } from "@/types/event-item";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
                <h2 className="text-xl font-medium">Events</h2>
                <Card className="rounded-none bg-slate-50">
                    <CardHeader className="sr-only">
                        <CardTitle className="text-xl">Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {events?.data
                            ?.sort((a: any, b: any) => (monthOrder[a.startMonth] || 0) - (monthOrder[b.startMonth] || 0))
                            .map((event) => (
                                <CalendarItem
                                    key={event.documentId}
                                    slug={event.slug}
                                    id={event.documentId}
                                    documentId={event.documentId}
                                    description={event.description}
                                    startDate={event.startDate}
                                    endDate={event.endDate}
                                    startMonth={event.startMonth}
                                    year={event.year}
                                    title={event.title}
                                    location={event.location}
                                />
                            )).slice(0, 3)}
                    </CardContent>
                    <CardFooter>
                        <Button asChild size="lg" variant="default" className="w-full sm:w-max">
                            <Link href={"/events"}>See all events</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}