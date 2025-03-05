import HomePageMap from "@/app/[locale]/_components/home-page-map";

export default async function HomePage({ params }: { params: { locale: string } }) {

  const { locale } = await params

  return (
    <section>
      <HomePageMap />
    </section>
  );
}
