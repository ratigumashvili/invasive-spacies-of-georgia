import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { SearchComponent } from "@/app/[locale]/_components/search";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";

import { generateFontByLocale } from "@/lib/utils";

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

    const {  } = resolvedSearchParams;

    return (
        <Container>
            <PageTitle locale={locale} />
            <SearchComponent />
        </Container>
    )
}