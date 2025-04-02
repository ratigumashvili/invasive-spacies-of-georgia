import qs from "qs";
import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";
import { Pagination } from "@/app/[locale]/_components/pagination";

import { fetchLegalDocs, getSinglePage } from "@/lib/api-calls";
import { formatDate, generateFontByLocale } from "@/lib/utils";

import { Link } from "@/i18n/routing";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const PageTitle = ({ locale }: { locale: string }) => {
    const t = useTranslations("LegalDocs")
    return (
        <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium mb-8`}>
            {t("page_title")}
        </h1>
    )
}

export default async function LegalDocs({ params, searchParams }: Props) {
    const { locale } = await params
    const resolvedSearchParams = await searchParams;
    const { page } = resolvedSearchParams

    const currentPage = Number(page) || 1

    const response = await fetchLegalDocs(locale, currentPage, 24)

    const sortedRecords = [...response.data].sort((a, b) => {
        const dateA = new Date(Number(a.date.year), (a.date.month || 1) - 1, a.date.day || 1);
        const dateB = new Date(Number(b.date.year), (b.date.month || 1) - 1, b.date.day || 1);
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <Container>
            <PageTitle locale={locale} />
            {sortedRecords?.map((document) => (
                <div key={document.id} className="mb-4">
                    <h2>{document.title} - {formatDate(document.date.day, document.date.month, document.date.year,)}</h2>
                    <p>{document.description}</p>
                    <Link href={document.url}>Read more</Link>
                </div>
            ))}
            <Pagination
                currentPage={currentPage}
                totalPages={response.meta.pagination.pageCount}
                pathname="legal-docs"
            />
        </Container>
    )
}