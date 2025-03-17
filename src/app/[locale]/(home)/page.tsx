import Container from '@/app/[locale]/_components/container';
import HomePageMap from "@/app/[locale]/_components/home-page-map";
import { AppTitle } from "@/app/[locale]/_components/app-title";
import { HomePageSlider } from "@/app/[locale]/_components/home-page-slider";
import { HomePageActions } from "@/app/[locale]/_components/home-page-actions";
import { HomePageBlocks } from '@/app/[locale]/_components/home-page-blocks/home-page-blocks';

import { fetchRandomSpecie, fetchSpeciesCoordinates, getEvents, getSinglePage } from "@/lib/api-calls";

import { HomePageData, } from '@/types/single-types';

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {

  const { locale } = await params

  const fetchHomePageData = async (locale: string): Promise<HomePageData> => {
    return await getSinglePage<HomePageData>("home-page", locale, "fields[0]=title&fields[1]=subtitle&fields[2]=version&populate[images][fields][0]=documentId&populate[images][fields][1]=name&populate[images][fields][2]=alternativeText&populate[images][fields][3]=caption&populate[images][fields][4]=width&populate[images][fields][5]=height&populate[images][fields][6]=url");
  };

  const data = await fetchHomePageData(locale)
  const events = await getEvents(locale)
  const randomSpecie = await fetchRandomSpecie(locale, "notNew")
  const newSpecies = await fetchRandomSpecie(locale, "isNew")
  const speciesCoordinates = await fetchSpeciesCoordinates(locale)

  const newCoordinates = speciesCoordinates?.data?.length
    ? speciesCoordinates.data.flatMap((item: any) =>
      item.places.map((place: any) => ({
        coordinates: place.coordinates,
        title: place.title
      }))
    )
    : [];

  const formattedCoordinates: formattedCoordinatesProps[] = newCoordinates.map(({ coordinates, title }) => ({
    coordinates: coordinates.split(",").map(Number) as [number, number],
    title
  }));

  interface formattedCoordinatesProps {
    coordinates: [number, number];
    title: string;
  }


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
        newSpecies={newSpecies}
        randomSpecie={randomSpecie}
        events={events}
      />

      <HomePageMap
        speciesCoordinates={formattedCoordinates.map(({ coordinates, title }) => ({
          coordinates,
          title
        }))}
      />

    </Container>
  );
}
