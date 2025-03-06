import { useTranslations } from "next-intl";

import HomePageMap from "@/app/[locale]/_components/home-page-map";
import Container from '@/app/[locale]/_components/container';

import { fetchSpeciesData } from "@/lib/api-calls";

function AppTitle() {
  const t = useTranslations("Common")
  return (
    <div className="flex flex-col gap-2 items-center mb-8">
      <h1 className="text-4xl font-medium tracking-tight">{t("title")}</h1>
      <h2 className="text-lg text-muted-foreground">{t("osd")}</h2>
    </div>
  )
}

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
      <HomePageMap data={latLngArray as [number, number][]} />
    </Container>
  );
}
