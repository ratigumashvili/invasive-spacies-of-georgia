import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { SearchComponent } from "@/app/[locale]/_components/search";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";

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

    const { name, type } = resolvedSearchParams;

    const data = type !== "species" 
        ? await searchSpecieByType(locale, type as string, name as string)
        : await searchSpecieByName(locale, name as string)

    return (
        <Container>
            <PageTitle locale={locale} />
            <SearchComponent />
            <pre>name: {JSON.stringify(name, null, 2)}</pre>
            <pre>type: {JSON.stringify(type, null, 2)}</pre>
            <pre>data: {JSON.stringify(data, null, 2)}</pre>
        </Container>
    )
}