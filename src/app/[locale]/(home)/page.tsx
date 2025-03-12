import Container from '@/app/[locale]/_components/container';
import HomePageMap from "@/app/[locale]/_components/home-page-map";
import { AppTitle } from "@/app/[locale]/_components/app-title";
import { HomePageSlider } from "@/app/[locale]/_components/home-page-slider";
import { HomePageActions } from "@/app/[locale]/_components/home-page-actions";
import { HomePageBlocks } from '@/app/[locale]/_components/home-page-blocks/home-page-blocks';

import { fetchRandomSpecie, fetchSpeciesData, getEvents, getSinglePage } from "@/lib/api-calls";

import { HomePageData, } from '@/types/single-types';

export default async function HomePage({ params }: { params: { locale: string } }) {

  const { locale } = await params

  const response = await fetchSpeciesData(locale, 30)

  const fetchHomePageData = async (locale: string): Promise<HomePageData> => {
    return await getSinglePage<HomePageData>("home-page", locale, "fields[0]=title&fields[1]=subtitle&fields[2]=version&populate[images][fields][0]=documentId&populate[images][fields][1]=name&populate[images][fields][2]=alternativeText&populate[images][fields][3]=caption&populate[images][fields][4]=width&populate[images][fields][5]=height&populate[images][fields][6]=url");
  };

  const data = await fetchHomePageData(locale)
  const events = await getEvents(locale)
  const randomSpecie = await fetchRandomSpecie(locale)

  const coordinates: string[] = response?.data?.length
    ? response.data.map((item: any) => (item.coordinates))
    : []

  const latLngArray: [number, number][] = coordinates
    .filter(coord => coord)
    .map(coord => {
      const [lat, lng] = coord.split(",").map(Number);
      return [lat, lng] as [number, number];
    });

  if (!data) return null

  return (
    <Container>
      <div className='relative mb-8'>
        <div className='absolute z-50 top-4 left-4 right-4 md:right-auto'>
          <AppTitle
            title={data?.title}
            subtitle={data?.subtitle}
            version={data?.version}
          />
        </div>
        <HomePageSlider images={data?.images} />
      </div>

      <HomePageActions />

      <HomePageBlocks
        randomSpecie={randomSpecie}
        events={events}
      />

      <HomePageMap data={latLngArray as [number, number][]} />
      <h1>latest reports</h1>
      <h1>user contributions</h1>
    </Container>
  );
}
