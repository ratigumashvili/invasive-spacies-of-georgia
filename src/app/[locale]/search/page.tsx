import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { SearchComponent } from "@/app/[locale]/_components/search";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";
import { Pagination } from "@/app/[locale]/_components/pagination";

import { generateFontByLocale } from "@/lib/utils";
import { searchSpecieByName, searchSpecieByType } from "@/lib/api-calls";

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

    let data;

    if (type && type !== "species") {
        data = await searchSpecieByType(locale, type as string, name as string, currentPage, 1);
    } else {
        data = await searchSpecieByName(locale, name as string, currentPage, 1);
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
            <pre>name: {JSON.stringify(name, null, 2)}</pre>
            <pre>type: {JSON.stringify(type, null, 2)}</pre>
            <pre>data: {JSON.stringify(data, null, 2)}</pre>
            <Pagination
                currentPage={currentPage}
                totalPages={data.meta.pagination.pageCount}
                pathname="search"
                query={{ name: name as string, type: type as string }}
            />
        </Container>
    )
}