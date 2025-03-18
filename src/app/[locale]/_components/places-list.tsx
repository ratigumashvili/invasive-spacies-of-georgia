import * as turf from "@turf/turf";
import { FeatureCollection, Geometry } from "geojson";

import geoJsonDataRaw from "@/app/[locale]/_data/coords.json";
import { useTranslations } from "next-intl";

interface PlacesListProps {
    id: number,
    documentId: string,
    title: string,
    coordinates: string
}

export function PlacesList({ data }: any) {

    const r = useTranslations("Regions")

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
        <div>
            {data.map((item: PlacesListProps) => {
                const placeCoordinates: [number, number] = item.coordinates.split(",").map(Number) as [number, number];
                const geoJsonData: FeatureCollection<Geometry, { NAME_2?: string; name?: string }> = geoJsonDataRaw as FeatureCollection<Geometry, { NAME_2?: string; name?: string }>;
                return (
                    <div key={item.documentId}>
                        {item.title}, 
                        {getRegionName(geoJsonData, placeCoordinates)}
                    </div>
                )
            })}
        </div>
    )
}