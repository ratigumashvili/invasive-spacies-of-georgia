import qs from "qs";

import Container from '@/app/[locale]/_components/container';
import HomePageMap from "@/app/[locale]/_components/home-page-map";
import { AppTitle } from "@/app/[locale]/_components/app-title";
import { HomePageSlider } from "@/app/[locale]/_components/home-page-slider";
import { HomePageActions } from "@/app/[locale]/_components/home-page-actions";
import { HomePageBlocks } from "@/app/[locale]/_components/home-page-blocks/home-page-blocks";
import { HomePageInfo } from "@/app/[locale]/_components/home-page-stata/home-page-info"
import { BrowseByTaxonomy } from '@/app/[locale]/_components/browse-by-taxonomy';
import { SearchComponent } from '@/app/[locale]/_components/search';

import { fetchAllSpeciesCoordinates, fetchRandomSpecie, getEvents, getSinglePage, getSpeciesCountByKingdom } from "@/lib/api-calls";

import { HomePageData, } from "@/types/single-types";
import { HomePageInfoCardNew } from "../_components/home-page-stata/home-page-ic-new";


type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {

  const { locale } = await params

  const homePageDataQuery = qs.stringify(
    {
      fields: ["title", "subtitle", "version"],
      populate: {
        images: {
          fields: [
            "documentId",
            "name",
            "alternativeText",
            "caption",
            "width",
            "height",
            "url"
          ]
        }
      }
    },
    { encodeValuesOnly: true }
  );

  const fetchHomePageData = async (locale: string): Promise<HomePageData> => {
    return await getSinglePage<HomePageData>("home-page", locale, homePageDataQuery);
  };

  const homepageData = await fetchHomePageData(locale)
  const events = await getEvents(locale)
  const randomSpecie = await fetchRandomSpecie(locale, "notNew")
  const newSpecies = await fetchRandomSpecie(locale, "isNew")
  const animalia = await getSpeciesCountByKingdom(locale, "Animalia")
  const plantae = await getSpeciesCountByKingdom(locale, "Plantae")
  const allCoordinates: any[] = await fetchAllSpeciesCoordinates(locale);

  const newCoordinates = allCoordinates.length
  ? allCoordinates.flatMap((item: any) =>
      item.places.map((place: any) => ({
        coordinates: place.coordinates,
        title: place.title,
        slug: place.slug,
      }))
    )
  : [];

const formattedCoordinates: formattedCoordinatesProps[] = newCoordinates.map(
  ({ coordinates, title, slug }) => ({
    coordinates: coordinates.split(',').map(Number) as [number, number],
    title,
    slug,
  })
);

  interface formattedCoordinatesProps {
    coordinates: [number, number];
    title: string;
    slug: string
  }


  if (!homepageData) return null

  return (
    <Container>
      {/* <div className='relative mb-8'>
        <div className='absolute z-50 top-4 left-4 right-4 md:right-auto'>
          <AppTitle
            title={data?.title}
            subtitle={data?.subtitle}
            version={data?.version}
          />
        </div>
        <HomePageSlider images={data?.images} />
      </div> */}

          <AppTitle
            title={homepageData?.title}
            subtitle={homepageData?.subtitle}
            version={homepageData?.version}
          />

        {/* <HomePageSlider images={data?.images} /> */}

      <HomePageActions />

      <HomePageBlocks
        newSpecies={newSpecies}
        randomSpecie={randomSpecie}
        events={events}
      />

      <BrowseByTaxonomy
        animaliaCount={animalia?.pagination.total as number}
        plantaeCount={plantae?.pagination.total as number}
      />

      <div className='mb-8'>
        <SearchComponent />
      </div>

      <HomePageInfo locale={locale} />

      {/* <HomePageInfoCardNew locale={locale} /> */}

      <HomePageMap
        speciesCoordinates={formattedCoordinates.map(({ coordinates, title, slug }) => ({
          coordinates,
          title,
          slug
        }))}
      />

    </Container>
  );
}
