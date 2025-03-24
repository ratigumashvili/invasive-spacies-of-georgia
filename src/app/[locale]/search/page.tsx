import Container from "@/app/[locale]/_components/container";
import { NothingFound } from "@/app/[locale]/_components/nothing-found";
import { Link } from "@/i18n/routing";
import { fetchSpeciesByCoordinates } from "@/lib/api-calls";
import { generateFontByLocale } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const PageTitle = ({ locale }: { locale: string }) => {
    const t = useTranslations("Search")
    return (
        <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium mb-8`}>
            {t("page_title")}
        </h1>
    )
}

export default async function Search({ params, searchParams }: Props) {
    const { locale } = await params
    const resolvedSearchParams = await searchParams;

    const {  } = resolvedSearchParams;

    // const formatCoordinates = (coords?: string | string[]) => {
    //     if (!coords) return "";

    //     if (Array.isArray(coords)) {
    //         return coords
    //             .map(coord => coord.replace(/\s*,\s*/g, ",%20"))
    //             .join(",");
    //     }

    //     return coords.replace(/\s*,\s*/g, ",%20");
    // };

    // const formattedCoordinates = formatCoordinates(coordinates);

    // const filter = `&filters[$and][0][coordinates][$eq]=${formattedCoordinates}`

    // const data = await fetchSpeciesByCoordinates(locale, 25, filter)

    // if (Object.keys(resolvedSearchParams).length !== 0 && data.data.length === 0) {
    //     return <NothingFound />
    // }

    return (
        <Container>
            <PageTitle locale={locale} />
            {/* {data && data.data.length !== 0 && (
                <div className="w-full overflow-x-auto" >
                    {data.data.map((item) => (
                        <div key={item.documentId}>
                            <h1 className="text-2xl font-medium mb-8">{item.title}</h1>
                            <table className="w-full min-w-7xl">
                                <thead>
                                    <tr className="tex-left py-4">
                                        <th>Scientific name</th>
                                        <th>Scientific name authorship</th>
                                        <th>Ecological group</th>
                                        <th>Family</th>
                                        <th>Genus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.species.map((specie) => (
                                        <tr key={specie.documentId}>
                                            <td><Link href={`/species-list/${specie.slug}`}>{specie.name}</Link></td>
                                            <td>{specie.autorName}</td>
                                            <td>{specie.ecologicalGroup}</td>
                                            <td>{specie.family.name}</td>
                                            <td>{specie.genus.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )} */}
        </Container>
    )
}