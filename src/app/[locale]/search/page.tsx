import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { SearchComponent } from "@/app/[locale]/_components/search";
import { SpeciesTable } from "@/app/[locale]/_components/species-table";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";
import { Pagination } from "@/app/[locale]/_components/pagination";

import { generateFontByLocale } from "@/lib/utils";
import { searchSpecieByName, searchSpecieByType } from "@/lib/api-calls";

import { Species } from "@/types/specie-response";
import { SearchResults } from "../_components/search-results";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const PageTitle = ({ locale }: { locale: string }) => {
    const t = useTranslations("Search")
    return (
        <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium mb-8`}>
            {t("page_title")}
        </h1>
    )
}

export default async function Search({ params, searchParams }: Props) {
    const { locale } = await params
    const resolvedSearchParams = await searchParams;

    const { name, type, page } = resolvedSearchParams;

    const currentPage = Number(page) || 1

    let response;

    if (type && type !== "species") {
        response = await searchSpecieByType(locale, type as string, name as string, currentPage, 1);
    } else {
        response = await searchSpecieByName(locale, name as string, currentPage, 1);
    }

    if (!name || !type) {
        return (
            <Container>
                <PageTitle locale={locale} />
                <SearchComponent />
            </Container>
        )
    }

    return (
        <Container>
            <PageTitle locale={locale} />
            
            <SearchComponent />
            
            {name && <SearchResults length={response.meta.pagination.total} />}
            
            {name && type && response.data.length === 0 && <NothingFound />}
            
            <section className="mt-8">
                <SpeciesTable data={response.data as Species[]} />
            </section>
            
            <Pagination
                currentPage={currentPage}
                totalPages={response.meta.pagination.pageCount}
                pathname="search"
                query={{ name: name as string, type: type as string }}
            />
        </Container>
    )
}