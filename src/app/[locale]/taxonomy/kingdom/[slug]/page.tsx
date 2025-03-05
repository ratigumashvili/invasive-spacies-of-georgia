export default async function KingdomSinglePage({params}: {params: {locale: string, slug: string}}) {
    const {locale, slug} = await params
    return (
        <section className="py-8">
            <pre>
                locale: {JSON.stringify(locale, null, 2)}
                <br />
                slug: {JSON.stringify(slug, null, 2)}
            </pre>
        </section>
    )
}