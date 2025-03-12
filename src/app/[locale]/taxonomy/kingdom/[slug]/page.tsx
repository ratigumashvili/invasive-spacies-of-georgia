type Props = {
    params: Promise<{ locale: string, slug: string }>
}

export default async function KingdomSinglePage({params}: Props) {
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