import qs from "qs";
import { useTranslations } from "next-intl";

import Container from "@/app/[locale]/_components/container";

import { getSinglePage } from "@/lib/api-calls";
import { formatDate, generateFontByLocale } from "@/lib/utils";

import { LegalDocumetns } from "@/types/legal-docs-response";

type Props = {
    params: Promise<{ locale: string }>
}

const filterQuery = {
    populate: {
        records: {
            fields: ["id", "title", "url", "description"],
            populate: {
                date: {
                    fields: ["day", "month", "year"]
                }
            }
        }
    }
}

const query = qs.stringify(filterQuery, {encodeValuesOnly: true})

const PageTitle = ({ locale }: { locale: string }) => {
    const t = useTranslations("LegalDocs")
    return (
        <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium mb-8`}>
            {t("page_title")}
        </h1>
    )
}

export default async function LegalDocs({ params }: Props) {
    const { locale } = await params

    const fetcLegalDocs = async (locale: string): Promise<LegalDocumetns> => {
        return await getSinglePage<LegalDocumetns>("legal-document", locale, query);
    };
    
    const response = await fetcLegalDocs(locale)

    return (
        <Container>
            <PageTitle locale={locale} />
            <pre>{JSON.stringify(response, null, 2)}</pre>
            {response?.records?.map((document) => (
                <div key={document.id}>
                    <h2>{document.title} - {formatDate(document.date.day, document.date.month, document.date.year,)}</h2>
                </div>
            ))}
        </Container>
    )
}