import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { TriangleAlertIcon } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventBlock } from "@/app/[locale]/_components/home-page-blocks/event-block";

import { HomePageBlocksProps } from "@/types/home-page-blocks";
import { SpecieBlock } from "./specie-block";
import { SingleSpecieList } from "@/types/random-specie";

const Translations = () => {
    const t = useTranslations("Common")

    return {
        speciesAlert: t("speciesAlert"),
        factSheets: t("species_factsheets"),
        eventsTitle: t("upcomming_events"),
        allEvents: t("see_all_events"),
    };
}

export async function HomePageBlocks({ events, randomSpecie, newSpecies }: HomePageBlocksProps) {

    const { factSheets, eventsTitle, allEvents, speciesAlert } = Translations()

    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl font-medium mb-3 flex items-center gap-2">
                    <TriangleAlertIcon className="text-red-800 fill-amber-500" /> {speciesAlert}
                </h2>
                <SpecieBlock data={newSpecies as SingleSpecieList} />
            </div>

            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl font-medium mb-3">{factSheets}</h2>
                <SpecieBlock data={randomSpecie as SingleSpecieList} />
            </div>

            <div className="flex flex-col gap-2 flex-1 shrink-0">
                <h2 className="text-xl font-medium mb-3">{eventsTitle}</h2>
                <Card className="rounded-none bg-slate-50 h-full p-0 py-6">
                    <CardHeader className="sr-only">
                        <CardTitle className="text-xl">
                            {eventsTitle}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EventBlock events={events} />
                    </CardContent>
                    <CardFooter className="mt-auto">
                        <Button asChild size="lg" variant="default" className="w-full lg:w-max rounded-none">
                            <Link href={"/events"}>{allEvents}</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </div>
    )
}