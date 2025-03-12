import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventBlock } from "@/app/[locale]/_components/home-page-blocks/event-block";

import { HomePageBlocksProps } from "@/types/home-page-blocks";
import { SpecieBlock } from "./specie-block";
import { SingleSpecieList } from "@/types/random-specie";

export async function HomePageBlocks({ events, SingleSpecieList }: HomePageBlocksProps) {

    const t = useTranslations("Common")

    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl font-medium mb-3">Species Alert</h2>
            </div>

            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl font-medium mb-3">{t("species_factsheets")}</h2>
                <SpecieBlock data={SingleSpecieList as SingleSpecieList} />
            </div>

            <div className="flex flex-col gap-2 flex-1 shrink-0">
                <h2 className="text-xl font-medium mb-3">{t("upcomming_events")}</h2>
                <Card className="rounded-none bg-slate-50 h-full p-0 py-6">
                    <CardHeader className="sr-only">
                        <CardTitle className="text-xl">
                            {t("upcomming_events")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EventBlock events={events} />
                    </CardContent>
                    <CardFooter className="mt-auto">
                        <Button asChild size="lg" variant="default" className="w-full lg:w-max rounded-none">
                            <Link href={"/events"}>{t("see_all_events")}</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </div>
    )
}