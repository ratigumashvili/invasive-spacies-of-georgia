import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";
import { SingleTaxonMeta } from "@/app/[locale]/_components/single-taxon-meta";

import { fetchSpeciesData } from "@/lib/api-calls";

import { type SpeciesResponse } from "@/types/taxonomy-types";

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
            <div className="grid grid-cols-3 gap-4 w-full">
                <div className="col-span-2">
                    <SingleTaxonMeta data={data} />
                </div>
                <div className="col-span-1">
                    <div className="my-8">
                        image <br />
                        map
                    </div>
                </div>
            </div>
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </Container>
    )
}