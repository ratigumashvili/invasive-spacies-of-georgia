import { Link } from "@/i18n/routing";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarItem } from "@/app/[locale]/_components/calendar-item";

import { HomePageBlocksProps } from "@/types/home-page-blocks";

import { monthOrder } from "@/lib/utils";

export function EventBlock({events}: HomePageBlocksProps) {
    return (
        <>
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
        </>
    )
}