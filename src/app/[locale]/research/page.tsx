import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import Container from "@/app/[locale]/_components/container";
import { Pagination } from "@/app/[locale]/_components/pagination";

import { fetchResearches } from "@/lib/api-calls";
import { generateFontByLocale } from "@/lib/utils";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const PageTitle = ({ locale }: { locale: string }) => {
    const t = useTranslations("Research")
    return (
        <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase mb-8`}>
            {t("page_title")}
        </h1>
    )
}

export default async function Research({ params, searchParams }: Props) {
    const { locale } = await params
    const resolvedSearchParams = await searchParams;
    const { page } = resolvedSearchParams

    const currentPage = Number(page) || 1

    const response = await fetchResearches(locale, currentPage, 24)

    return (
        <Container>

            <PageTitle locale={locale} />

            <ul>
                {response?.data?.map((research) => (
                    <li key={research.documentId} className="list mb-2">
                        <Link href={`/research/${research.slug}`}>{research.title}</Link>
                    </li>
                ))}
            </ul>

            <Pagination
                currentPage={currentPage}
                totalPages={response.meta.pagination.pageCount}
                pathname="research"
            />
        </Container>
    )
}