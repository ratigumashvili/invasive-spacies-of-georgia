import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventBlock } from "@/app/[locale]/_components/home-page-blocks/event-block";

import { HomePageBlocksProps } from "@/types/home-page-blocks";

export async function HomePageBlocks({ events }: HomePageBlocksProps) {

    const t = useTranslations("Common")

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl">Species Alert</h2>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl">Species Factsheets</h2>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl font-medium mb-3">{t("upcomming_events")}</h2>
                <Card className="rounded-none bg-slate-50">
                    <CardHeader className="sr-only">
                        <CardTitle className="text-xl">
                            {t("upcomming_events")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EventBlock events={events} />
                    </CardContent>
                    <CardFooter>
                        <Button asChild size="lg" variant="default" className="w-full sm:w-max">
                            <Link href={"/events"}>{t("see_all_events")}</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}