import { useTranslations } from "next-intl";

import Container from '@/app/[locale]/_components/container';
import { AppTitle } from "@/app/[locale]/_components/app-title";
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
    <Container>
      <AppTitle />
      <h1>hero section</h1>
      <h1>species list grid (last added)</h1>
      <HomePageMap data={latLngArray as [number, number][]} />
      <h1>latest reports</h1>
      <h1>user contributions</h1>
    </Container>
  );
}
