"use client"

import { useEffect, useState } from "react";
import * as turf from "@turf/turf";
import { FeatureCollection, Geometry } from "geojson";
import { useTranslations } from "next-intl";
import { GlobeIcon } from "lucide-react";

import { SpecieBlock } from "@/app/[locale]/_components/home-page-blocks/specie-block";
import { DropDownAction } from "@/app/[locale]/_components/drop-down-actions";
import { Separator } from "@/components/ui/separator";
import { Views } from "@/app/[locale]/_components/views";

import { generateFontByLocale, isLocalStorageAvailable } from "@/lib/utils";

import geoJsonDataRaw from "@/app/[locale]/_data/coords.json";

import { Place } from "@/types/taxonomy-types";
import { Species } from "@/types/specie-response";
import { Link } from "@/i18n/routing";

export function SinglePlaceComponent({
    place,
    coordinates,
    data,
    locale
}: {
    place: Place[],
    coordinates: string,
    data: Species[],
    locale: string
}) {

    const r = useTranslations("Regions")
    const t = useTranslations("Places")

    function getRegionName(
        geoJsonData: FeatureCollection<Geometry, { NAME_2?: string; name?: string }>,
        coordinates: [number, number]
    ): string | null {

        if (!place || place?.length === 0) return null

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

    const placeCoordinates: [number, number] = coordinates?.split(",").map(Number) as [number, number];
    const geoJsonData: FeatureCollection<Geometry, { NAME_2?: string; name?: string }> = geoJsonDataRaw as FeatureCollection<Geometry, { NAME_2?: string; name?: string }>;

    const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");

    useEffect(() => {
        if (!isLocalStorageAvailable()) return;

        const storedView = localStorage.getItem("view");
        if (storedView === "list" || storedView === "grid") {
            setSelectedView(storedView);
        }
    }, []);

    return (
        <div>
            <div className="mb-8 flex items-start justify-baseline">
                <div className="w-full">
                    <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium`}>
                        {place[0]?.title}, {getRegionName(geoJsonData, placeCoordinates)}
                    </h1>
                    <h2 className="text-base text-muted-foreground flex items-center">
                        <GlobeIcon className="w-4 h-4 mr-1" /> {coordinates}
                    </h2>
                </div>
                <div className="flex items-center gap-1">
                    <DropDownAction />
                    <Views selectedView={selectedView} setSelectedView={setSelectedView} />
                </div>
            </div>
            <Separator className="my-8" />

            {selectedView === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.map((item) => (
                        <SpecieBlock key={item.documentId} data={{ ...item, locale }} />
                    ))}
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Scientific name</th>
                            <th>Name according to</th>
                            <th>Ecological group</th>
                            <th>Introduced</th>
                            <th>Detected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item) => (
                            <tr key={item.documentId}>
                                <td>
                                    <Link href={`/species-list/${item.slug}`} className="text-sky-800 font-medium hover:underline">{item.name}</Link>
                                </td>
                                <td>{item.autorName}</td>
                                <td>{item.ecologicalGroup}</td>
                                <td>{item.firstIntroduced}</td>
                                <td>{item.dateOfDetection}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}