import { BrowseByTaxonomy } from "@/app/[locale]/_components/browse-by-taxonomy"

export default async function TaxonomtPage({params}: {params: {locale: string}}) {
    const {locale} = await params
    return (
        <section className="py-8">
            <BrowseByTaxonomy locale={locale} />
        </section>
    )
}