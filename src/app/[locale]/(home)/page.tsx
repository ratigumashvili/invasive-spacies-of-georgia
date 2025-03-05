import { BrowseByTaxonomy } from "@/app/[locale]/_components/browse-by-taxonomy";
import { Link } from "@/i18n/routing";
import { fetchStrapiData } from "@/lib/api-calls";
import { TaxonomyAPIResponse } from "@/types/taxonomy-types";

export default async function HomePage({ params }: { params: { locale: string } }) {

  const { locale } = await params

  let response: TaxonomyAPIResponse | null;

  try {
    response = await fetchStrapiData("kingdoms", { locale, populate: "*" });
  } catch (error) {
    console.error("Error fetching kingdoms:", error);
    response = null;
  }

  return (
    <section className='py-8'>
      Home
      <pre>
        {JSON.stringify(response, null, 2)}
      </pre>
      {/* <BrowseByTaxonomy locale={locale} /> */}
      <ul>
        {response && response?.data?.length !==0 && response?.data.map((item) => (
          <li key={item.id}>
            {item.rank.rank} {item.name}
            {item.phyla.length !== 0 && (
              <ul className="ml-4">
                {item.phyla.map((phylum) => (
                  <li key={phylum.id}>
                    <Link href={`/taxonomy/${phylum.slug}`}>{phylum.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
