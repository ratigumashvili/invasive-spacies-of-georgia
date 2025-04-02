import { getAllSpeciesCount } from "@/lib/api-calls"
import { HomePageInfoCard } from "./home-page-info-card";

export async function HomePageInfo({ locale }: { locale: string }) {

    const totalRecords = await getAllSpeciesCount(locale)
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

    const total = Number(totalRecords?.pagination.total)
    const contributted = Number(contributedSpeciesMeta?.pagination?.total)
    const pending = Number(pendingSpecies?.pagination.total)

    const totalContributted = Number((contributted / total * 100).toFixed(2))
    const totalPending = Number((pending / total * 100).toFixed(2))

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <HomePageInfoCard
                locale={locale as "ka" | "en"}
                title={"total"}
                total={totalRecords?.pagination.total as number}
            />
            <HomePageInfoCard
                locale={locale as "ka" | "en"}
                title={"contributed"}
                description={"species_total"}
                total={contributedSpeciesMeta?.pagination.total as number}
                percentage={totalContributted}
            />
            <HomePageInfoCard
                locale={locale as "ka" | "en"}
                title={"pending"}
                description={"species_total"}
                total={pendingSpecies?.pagination.total as number}
                percentage={totalPending}
            />
        </div>
    )
}