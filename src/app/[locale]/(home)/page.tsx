import qs from "query-string"

import HomePageMap from "@/app/[locale]/_components/home-page-map";

import { fetchSpeciesData } from "@/lib/api-calls";

export default async function HomePage({ params }: { params: { locale: string } }) {

  const { locale } = await params

  const response = await fetchSpeciesData(locale, 30)

  const coordinates: string[] = response?.data?.length
    ? response.data.map((item: any) => (item.coordinates))
    : []

  const latLngArray: [number, number][] = coordinates
    .filter(coord => coord)
    .map(coord => {
      const [lat, lng] = coord.split(",").map(Number);
      return [lat, lng] as [number, number];
    });

  return (
    <section className="h-full flex flex-col justify-center">
      <HomePageMap data={latLngArray as [number, number][]} />
    </section>
  );
}
