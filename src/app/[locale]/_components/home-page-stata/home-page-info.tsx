import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { getAllSpeciesCount } from "@/lib/api-calls"
import { generateFontByLocale } from "@/lib/utils";
import { HomePageInfoCard } from "./home-page-info-card";

export async function HomePageInfo({ locale }: { locale: string }) {

    const publishedSpecies = await getAllSpeciesCount(locale)
    const contributedSpeciesMeta = await getAllSpeciesCount(locale, {
        $and: [
            {
                submissionAuthor: {
                    $notNull: true
                }
            }
        ]
    });
    const pendingSpecies = await getAllSpeciesCount(locale, {
        $and: [
            {
                publishingStatus: {
                    $eq: "pending"
                }
            }
        ]
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <HomePageInfoCard
                locale={locale}
                title={"published"}
                total={publishedSpecies?.pagination.total as number}
            />
            <HomePageInfoCard
                locale={locale}
                title={"contributed"}
                total={contributedSpeciesMeta?.pagination.total as number}
            />
            <HomePageInfoCard
                locale={locale}
                title={"contributed"}
                total={pendingSpecies?.pagination.total as number}
            />
        </div>
    )
}