import qs from "qs";

import Container from "@/app/[locale]/_components/container";

import { getSinglePage } from "@/lib/api-calls";

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

export default async function LegalDocs({ params }: Props) {
    const { locale } = await params

    const fetcLegalDocs = async (locale: string): Promise<LegalDocumetns> => {
        return await getSinglePage<LegalDocumetns>("legal-document", locale, query);
    };
    
    const response = await fetcLegalDocs(locale)

    return (
        <Container>Legal docs
            <pre>{JSON.stringify(response, null, 2)}</pre>
        </Container>
    )
}