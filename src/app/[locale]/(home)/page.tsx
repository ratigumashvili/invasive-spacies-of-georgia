import HomePageMap from "@/app/[locale]/_components/home-page-map";
import { fetchStrapiData } from "@/lib/api-calls";

export default async function HomePage({ params }: { params: { locale: string } }) {

  const { locale } = await params

  const response = await fetchStrapiData("species", {
    populate: "*",
    pageSize: 30,
    locale
});


const coordinates = response?.data?.length 
? response.data.map((item: any) => (item.coordinates))
: []

const latLngArray: [number, number][] = coordinates
  .filter(coord => coord)
  .map(coord => {
    const [lat, lng] = coord.split(",").map(Number);
    return [lat, lng] as [number, number];
  });

  return (
    <section>
      {/* <pre>{JSON.stringify(response, null, 2)}</pre> */}
      <HomePageMap data={latLngArray as [number, number][]} />
    </section>
  );
}
