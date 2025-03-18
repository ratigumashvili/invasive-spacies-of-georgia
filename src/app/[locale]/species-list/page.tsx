import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { Pagination } from "@/app/[locale]/_components/pagination";
import { SpecieBlock } from "@/app/[locale]/_components/home-page-blocks/specie-block";
import { DropDownAction } from "@/app/[locale]/_components/drop-down-actions";

import { fetchSpeciesData } from "@/lib/api-calls";
import { generateFontByLocale } from "@/lib/utils";

import { SingleSpecieList } from "@/types/random-specie";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const PageTitle = ({ locale }: { locale: string }) => {
    const t = useTranslations("Common")
    return (
        <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium`}>
            {t("species_list")}
        </h1>
    )
}

export default async function SpeciesList({ params, searchParams }: Props) {
    const { locale } = await params
    const resolvedSearchParams = await searchParams
    const currentPage = Number(resolvedSearchParams.page) || 1

    const response = await fetchSpeciesData(locale, currentPage)

    return (
        <Container>
            <div>
                <div className="flex items-center justify-between mb-8">
                    <PageTitle locale={locale} />
                    <DropDownAction />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {response?.data?.map((item: SingleSpecieList) => (
                        <SpecieBlock key={item.documentId} data={item as SingleSpecieList} />
                    ))}
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={response?.meta.pagination.pageCount as number}
                pathname={`species-list`}
            />
        </Container>
    )
}