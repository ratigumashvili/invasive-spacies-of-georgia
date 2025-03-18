import * as turf from "@turf/turf";
import { FeatureCollection, Geometry } from "geojson";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import geoJsonDataRaw from "@/app/[locale]/_data/coords.json";

import { generateFontByLocale } from "@/lib/utils";
import { GlobeIcon } from "lucide-react";

interface PlacesListProps {
    id: number,
    documentId: string,
    title: string,
    slug: string,
    coordinates: string,
    species: []
}

export function PlacesList({ data, locale }: { data: any, locale: string }) {

    const r = useTranslations("Regions")
    const t = useTranslations("Places")

    function getRegionName(
        geoJsonData: FeatureCollection<Geometry, { NAME_2?: string; name?: string }>,
        coordinates: [number, number]
    ): string | null {
        const point = turf.point([coordinates[1], coordinates[0]]);

        for (const feature of geoJsonData.features) {
            const { geometry, properties } = feature;
            const regionName = properties?.NAME_2 || properties?.name;

            if (!geometry || !regionName) continue;
            if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon") continue;

            if (geometry.type === "Polygon") {
                const polygon = turf.polygon(geometry.coordinates as number[][][]);
                if (turf.booleanPointInPolygon(point, polygon)) {
                    return r(regionName);
                }
            } else if (geometry.type === "MultiPolygon") {
                for (const polygon of geometry.coordinates) {
                    const multiPolygon = turf.polygon(polygon as number[][][]);
                    if (turf.booleanPointInPolygon(point, multiPolygon)) {
                        return regionName;
                    }
                }
            }
        }

        return null;
    }

    return (
        <>
            <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium mb-8`}>
                {t("page_title")}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item: PlacesListProps) => {
                    const placeCoordinates: [number, number] = item.coordinates.split(",").map(Number) as [number, number];
                    const geoJsonData: FeatureCollection<Geometry, { NAME_2?: string; name?: string }> = geoJsonDataRaw as FeatureCollection<Geometry, { NAME_2?: string; name?: string }>;
                    return (
                        <Card key={item.documentId} className="rounded-none">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-y-2">
                                <p>{t("region")}: {getRegionName(geoJsonData, placeCoordinates)}</p>
                                <p className="flex items-center gap-2">
                                    <span title={t("coordinates")}>
                                        <GlobeIcon className="w-4 h-4" />
                                    </span> {item.coordinates}
                                </p>
                                <p>{t("recorded_species")}: {item.species.length}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="rounded-none">
                                    <Link href={`/places/${item.slug}`}>{t("read_more")}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </>
    )
}