import Container from "@/app/[locale]/_components/container";
import { Pagination } from "@/app/[locale]/_components/pagination";
import { Link } from "@/i18n/routing";

import { fetchResearches } from "@/lib/api-calls";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Research({ params, searchParams }: Props) {
    const { locale } = await params
    const resolvedSearchParams = await searchParams;
    const { page } = resolvedSearchParams

    const currentPage = Number(page) || 1

    const response = await fetchResearches(locale, currentPage, 1)

    return (
        <Container>

            <ul>
                {response?.data?.map((research) => (
                    <li key={research.documentId}>
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