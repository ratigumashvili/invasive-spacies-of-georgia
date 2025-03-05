import { BrowseByTaxonomy } from "@/app/[locale]/_components/browse-by-taxonomy";

export default async function HomePage({ params }: { params: { locale: string } }) {

  const { locale } = await params
  return (
    <section className='py-8'>
      Home
      <BrowseByTaxonomy locale={locale} />
    </section>
  );
}
