import { fetchStrapiData } from "@/lib/api-calls";

export default async function HomePage({params}: {params: {locale: string}}) {

  const {locale} = await params
  
  let response;
  try {
    response = await fetchStrapiData("kingdoms", { page: 1, pageSize: 10, locale, populate: "*" });
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
    </section>
  );
}
