import Image from "next/image";
import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";
import { SingleTaxonMeta } from "@/app/[locale]/_components/single-taxon/single-taxon-meta";
import { DropDownAction } from "@/app/[locale]/_components/drop-down-actions";
import SingleTaxonMap from "@/app/[locale]/_components/single-taxon/show-map";
import { GeneratePdfButton } from "@/app/[locale]/_components/generate-pdf-button";
import { SingleSpecieCite } from "@/app/[locale]/_components/single-specie-cite";

import { fetchSpeciesData, getSinglePage } from "@/lib/api-calls";

import { Place } from "@/types/taxonomy-types";

import { BASE_URL, cn, formatDate, getOldestDetectionDate, removeDuplicateDetectionDates, strapiRichTextToPlainText } from "@/lib/utils";
import { SpeciesResponse } from "@/types/specie-response";
import { HomePageData } from "@/types/single-types";

const PageTitle = () => {
    const t = useTranslations("Common")
    return (
        <h1 className={cn("text-2xl font-medium print:hidden")}>{t("species_factsheets")}</h1>
    )
}

type Props = {
    params: Promise<{ slug: string, locale: string }>
}

export default async function SingleSpecieList({ params }: Props) {

    const { slug, locale } = await params

    const filter = `&filters[$and][0][slug][$eq]=${slug}`

    const { data, meta }: SpeciesResponse = await fetchSpeciesData(locale, 1, 1, filter);

    const fetchAppTitle = async (locale: "en"): Promise<HomePageData> => {
        return await getSinglePage<HomePageData>("home-page", locale, "fields[0]=title&fields[1]=subtitle&fields[2]=version");
    };

    const detectionDates = removeDuplicateDetectionDates(
        data[0]?.detectionDate || []
    );

    const oldest = getOldestDetectionDate(data[0]?.detectionDate || []);

    if (data?.length === 0 || meta.pagination.total === 0) return <NothingFound />

    const downloadData = {
        kingdom: data[0]?.kingdom.name,
        phylum: data[0]?.phylum.name,
        class: data[0]?.class.name,
        order: data[0]?.order.name,
        family: data[0]?.family.name,
        genus: data[0]?.genus.name,
        scientific_name: data[0]?.name,
        scientific_name_authorship: data[0]?.autorName,
        taxonId: data[0]?.scientificNameId,
        taxonId_url: data[0]?.scientificNameUrl,
        habitatType: data[0]?.habitats.map((item) => item.code),
        ecologicalGroup: data[0]?.lifeForm,
        status: data[0]?.taxonStatus,
        riskAssessed: data[0]?.riskAssessed,
        riskAssessedUrl: data[0]?.riskAssessedUrl,
        firstRecordInGeorgia: formatDate(oldest?.day, oldest?.month, oldest?.year),
        dateDetected: detectionDates.map((date) => (formatDate(date.day, date.month, date.year))),
        recordNumber: data[0]?.places.length || 0,
        identification: strapiRichTextToPlainText(data[0]?.identification ?? []),
        ecology: strapiRichTextToPlainText(data[0]?.ecology ?? []),
        distribution: strapiRichTextToPlainText(data[0]?.distribution ?? []),
        invasionHistory: strapiRichTextToPlainText(data[0]?.invasionHistory ?? []),
        impact: strapiRichTextToPlainText(data[0]?.impact ?? []),
        whatCanIDo: strapiRichTextToPlainText(data[0]?.wcid ?? []),
        references: strapiRichTextToPlainText(data[0]?.references ?? []),
    }

    const coordinates = data[0]?.places?.map((item) => item.coordinates)
    const [latStr, lngStr] = coordinates[0].split(",").map((part) => part.trim())

    const downloadDistributionData = data[0]?.places?.map((place) => ({
        place: place.title,
        lat: latStr,
        lng: lngStr
    })) ?? [];

    const appData = await fetchAppTitle("en")

    return (
        <Container>
            <div className="flex items-center justify-between mb-8 print:hidden">
                <PageTitle />
                <DropDownAction
                    specieData={downloadData}
                    distribution={downloadDistributionData}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4 w-full">
                <div className="col-span-2 print:col-span-3">
                    <SingleTaxonMeta data={data} />
                </div>
                <div className="col-span-1 print:hidden">
                    <div className="my-0">
                        {data[0]?.image?.url ? (
                            <div className="mb-4">
                                <Image
                                    src={`${BASE_URL}${data[0]?.image?.url}`}
                                    width={data[0]?.image.width}
                                    height={data[0]?.image.height}
                                    alt={data[0]?.name}
                                    className="object-contain"
                                />
                                <p className="my-1 text-xs text-muted-foreground italic">{data[0]?.image.caption}</p>
                            </div>
                        ) : null}
                        {data.length > 0 && data[0].places && (
                            <SingleTaxonMap places={data[0].places as Place[]} />
                        )}
                    </div>
                </div>
            </div>
            <SingleSpecieCite
                authors={data[0]?.authors}
                recordTitle={data[0]?.name}
                recordAuthor={data[0]?.autorName as string}
                appTitle={appData.title}
                appSubTitle={appData.subtitle}
                appVersion={appData.version}
            />
            <GeneratePdfButton data={data[0]} />
        </Container>
    )
}