import Image from "next/image";
import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";
import { SingleTaxonMeta } from "@/app/[locale]/_components/single-taxon/single-taxon-meta";
import { DropDownAction } from "@/app/[locale]/_components/drop-down-actions";
import SingleTaxonMap from "@/app/[locale]/_components/single-taxon/show-map";

import { fetchSpeciesData } from "@/lib/api-calls";

import { Place } from "@/types/taxonomy-types";

import { BASE_URL } from "@/lib/utils";
import { SpeciesResponse } from "@/types/specie-response";

const PageTitle = () => {
    const t = useTranslations("Common")
    return (
        <h1 className="text-2xl font-medium">{t("species_factsheets")}</h1>
    )
}

type Props = {
    params: Promise<{ slug: string, locale: string }>
}

export default async function SingleSpecieList({ params }: Props) {
    const { slug, locale } = await params

    const filter = `&filters[$and][0][slug][$eq]=${slug}`

    const { data, meta }: SpeciesResponse = await fetchSpeciesData(locale, 1, 1, filter);

    if (data?.length === 0 || meta.pagination.total === 0) return <NothingFound />

    return (
        <Container>
            <div className="flex items-center justify-between mb-8">
                <PageTitle />
                <DropDownAction />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4 w-full">
                <div className="col-span-2">
                    <SingleTaxonMeta data={data} />
                </div>
                <div className="col-span-1">
                    <div className="my-0 md:my-8 lg:my-0">
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
        </Container>
    )
}