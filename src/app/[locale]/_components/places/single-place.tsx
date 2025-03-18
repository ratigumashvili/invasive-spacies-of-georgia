import * as turf from "@turf/turf";
import { FeatureCollection, Geometry } from "geojson";
import { useTranslations } from "next-intl";
import { GlobeIcon } from "lucide-react";


import { NothingFound } from "@/app/[locale]/_components/nothing-found";

import { SpecieBlock } from "@/app/[locale]/_components/home-page-blocks/specie-block";
import { Separator } from "@/components/ui/separator";

import { generateFontByLocale } from "@/lib/utils";

import geoJsonDataRaw from "@/app/[locale]/_data/coords.json";
import { SingleSpecieList } from "@/types/random-specie";

export function SinglePlaceComponent({ data, locale }: { data: any, locale: string }) {

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

    const placeCoordinates: [number, number] = data[0]?.coordinates?.split(",").map(Number) as [number, number];
    const geoJsonData: FeatureCollection<Geometry, { NAME_2?: string; name?: string }> = geoJsonDataRaw as FeatureCollection<Geometry, { NAME_2?: string; name?: string }>;

    if (data.length === 0) {
        return <NothingFound />
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium`}>
                    {data[0]?.title}, {getRegionName(geoJsonData, placeCoordinates)}
                </h1>
                <h2 className="text-base text-muted-foreground flex items-center">
                    <GlobeIcon className="w-4 h-4 mr-1" /> {data[0]?.coordinates}
                </h2>
            </div>
            <Separator className="my-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data[0]?.species?.map((item: SingleSpecieList) => (
                    <SpecieBlock key={item.documentId} data={item as SingleSpecieList} />
                ))}
            </div>
        </div>
    )
}