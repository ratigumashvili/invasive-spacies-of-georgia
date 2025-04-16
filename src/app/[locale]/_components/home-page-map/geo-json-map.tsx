"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import * as turf from "@turf/turf";
import L, { PathOptions } from "leaflet";
import { Feature, Geometry } from "geojson";
import { useTranslations } from "next-intl";
import { DownloadIcon } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import type { FeatureCollection } from "geojson";
import data from "@/app/[locale]/_data/coords.json";
import { BASE_API_URL } from "@/lib/utils";

type GeoJSONFeature = Feature<Geometry, { NAME_2?: string; name?: string }>;
type GeoJSONData = { type: "FeatureCollection"; features: GeoJSONFeature[] };

type SpeciesCoordinate = {
    coordinates: [number, number];
    title: string;
    slug: string;
};

const calculateRegionDensity = (geoJson: GeoJSONData, coordinates: SpeciesCoordinate[]) => {
    const regionCounts: Record<string, number> = {};

    coordinates.forEach(({ coordinates }) => {
        const point = turf.point([coordinates[1], coordinates[0]]);

        geoJson.features.forEach((feature) => {
            const { geometry, properties } = feature;
            const regionName = properties?.NAME_2 || properties?.name;

            if (!geometry || !regionName) return;
            if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon") return;

            const polygons =
                geometry.type === "Polygon"
                    ? [geometry.coordinates]
                    : geometry.coordinates;

            polygons.forEach((polygon) => {
                const poly = turf.polygon(polygon as number[][][]);
                if (turf.booleanPointInPolygon(point, poly)) {
                    regionCounts[regionName] = (regionCounts[regionName] || 0) + 1;
                }
            });
        });
    });

    return regionCounts;
};

export default function GeoJsonMap({ speciesCoordinates }: { speciesCoordinates: SpeciesCoordinate[] }) {
    const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
    const [regionData, setRegionData] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    const t = useTranslations("Regions");

    useEffect(() => {
        const geoJsonTyped = data as GeoJSONData;
        setGeoData(geoJsonTyped);

        if (!speciesCoordinates || speciesCoordinates.length === 0) {
            console.warn("⚠️ No species coordinates available.");
            return;
        }

        const calculatedRegionData = calculateRegionDensity(geoJsonTyped, speciesCoordinates);
        setRegionData(calculatedRegionData);
        setLoading(false);
    }, [speciesCoordinates]);

    const getRegionStyle = (feature: Feature<Geometry, any> | undefined): PathOptions => {
        if (!feature || !feature.properties) {
            return { color: "#0056b3", weight: 1.5, fillOpacity: 0.2 };
        }

        const regionName = feature.properties.NAME_2 || feature.properties.name;
        const recordCount = regionData[regionName] || 0;
        const opacity = Math.min(0.2 + recordCount / 10, 0.8);

        const isSelected = selectedRegion === regionName;

        return {
            color: isSelected ? "#ff6600" : "#0056b3",             // border color
            weight: isSelected ? 1.5 : 1.5,                        // thicker border when selected
            fillColor: isSelected ? "#ffa366" : (recordCount > 0 ? "#004080" : "#cccccc"),
            fillOpacity: isSelected ? 0.8 : opacity,
        };
    };

    const filteredMarkers = speciesCoordinates.filter(({ coordinates }) => {
        if (!geoData || !selectedRegion) return true;

        const point = turf.point([coordinates[1], coordinates[0]]);
        return geoData.features.some((feature) => {
            const { geometry, properties } = feature;
            const regionName = properties?.NAME_2 || properties?.name;
            if (!geometry || regionName !== selectedRegion) return false;

            let polygons: number[][][][] = [];

            if (geometry.type === "Polygon") {
                polygons = [geometry.coordinates as number[][][]];
            } else if (geometry.type === "MultiPolygon") {
                polygons = geometry.coordinates as number[][][][];
            } else {
                return false;
            }

            return polygons.some((polygon) =>
                turf.booleanPointInPolygon(point, turf.polygon(polygon as number[][][]))
            );
        });
    });

    const markers = filteredMarkers.map(({ coordinates, title, slug }, index) => {
        return (
            <Marker
                key={index}
                position={[coordinates[0], coordinates[1]]}
                icon={L.divIcon({
                    className: `marker`,
                    html: `<div style="width: 10px; height: 10px; background: red; border-radius: 50%;"></div>`,
                })}
            >
                <Popup>
                    <p className="text-sm"><span className="font-medium">{t("place")}</span>: {title}</p>
                    <p><span className="font-medium">{t("region")}</span>: {selectedRegion || "None"}</p>
                    <Link
                        href={`/places/${slug}`}
                        className="block my-2 !text-sky-800 !hover:text-red-600 transition"
                    >
                        {t("readmore")}
                    </Link>
                </Popup>
            </Marker>
        );
    });

    const onEachRegion = (feature: Feature<Geometry, any>, layer: L.Layer) => {
        const regionName = feature.properties?.NAME_2 || feature.properties?.name;
        const recordCount = regionData[regionName] || 0;

        const pathLayer = layer as L.Path;
        pathLayer.options.interactive = true;

        layer.bindPopup(`<b>${t(`${regionName}`)}</b><br>${t("records")}: ${recordCount}`);
        layer.on("click", (e) => {
            layer.openPopup(e.latlng);
            e.originalEvent.stopPropagation();
        });
    };

    const filteredFeatures: Feature<Geometry, any>[] = selectedRegion
        ? geoData?.features.filter((f) => {
            const name = f.properties?.NAME_2 || f.properties?.name;
            return name === selectedRegion;
        }) ?? []
        : geoData?.features ?? [];

    const filteredGeoData: FeatureCollection<Geometry, any> = {
        type: "FeatureCollection",
        features: filteredFeatures,
    };


    return (
        <>
            <MapContainer className="w-full h-[500px] rounded-md" center={[41.8, 44.5]} zoom={7} scrollWheelZoom={false}>
                <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                />

                {geoData && (
                    <GeoJSON
                        data={filteredGeoData}
                        style={(feature) => getRegionStyle(feature)}
                        onEachFeature={onEachRegion}
                    />
                )}

                {markers}

                <Link
                    href={`${BASE_API_URL}/export-coordinates/species`}
                    className="absolute top-20 left-3 z-[1000] bg-white border p-[6px] rounded-[2px] shadow !text-black"
                >
                    <DownloadIcon className="w-4 h-4" />
                </Link>

                <div className="absolute top-3 right-3 z-[1000]">
                    <Select
                        value={selectedRegion || "__all__"}
                        onValueChange={(value) => {
                            setSelectedRegion(value === "__all__" ? null : value);
                        }}
                    >
                        <SelectTrigger className="w-[200px] bg-white">
                            <SelectValue placeholder={t("selectRegion")} />
                        </SelectTrigger>

                        <SelectContent className="z-[1000]">
                            <SelectItem value="__all__">{t("all")}</SelectItem>
                            {geoData?.features.map((f, i) => {
                                const name = f.properties?.NAME_2 || f.properties?.name;
                                return name ? (
                                    <SelectItem key={i} value={name}>
                                        {name}
                                    </SelectItem>
                                ) : null;
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </MapContainer>
        </>
    );
}
