import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";
import { SingleTaxonMeta } from "@/app/[locale]/_components/single-taxon/single-taxon-meta";
import SingleTaxonMap from "@/app/[locale]/_components/single-taxon/show-map";

import { fetchSpeciesData } from "@/lib/api-calls";

import { Place, type SpeciesResponse } from "@/types/taxonomy-types";
import Image from "next/image";
import { BASE_URL } from "@/lib/utils";

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

    const { data, meta }: SpeciesResponse = await fetchSpeciesData(locale, 1, filter);

    if (data?.length === 0 || meta.pagination.total === 0) return <NothingFound />

    return (
        <Container>
            <PageTitle />
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            <div className="grid grid-cols-3 gap-4 w-full">
                <div className="col-span-2">
                    <SingleTaxonMeta data={data} />
                </div>
                <div className="col-span-1">
                    <div className="my-8">
                        <Image
                            src={`${BASE_URL}${data[0]?.image.url}`}
                            width={data[0]?.image.width}
                            height={data[0]?.image.height}
                            alt={data[0]?.name}
                            className="object-contain"
                        />
                        <p className="my-1 text-xs text-muted-foreground italic">{data[0]?.image.caption}</p>
                        {data.length > 0 && data[0].places && (
                            <SingleTaxonMap places={data[0].places as Place[]} />
                        )}
                    </div>
                </div>
            </div>
        </Container>
    )
}