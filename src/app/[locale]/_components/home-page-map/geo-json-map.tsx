"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import * as turf from "@turf/turf";
import L, { PathOptions } from "leaflet";
import { Feature, Geometry } from "geojson";
import { useTranslations } from "next-intl";

import data from "@/app/[locale]/_data/coords.json";

type GeoJSONFeature = Feature<Geometry, { NAME_2?: string; name?: string }>;
type GeoJSONData = { type: "FeatureCollection"; features: GeoJSONFeature[] };

type SpeciesCoordinate = {
    coordinates: [number, number];
    title: string;
    slug: string
};

const calculateRegionDensity = (geoJson: GeoJSONData, coordinates: SpeciesCoordinate[]) => {
    const regionCounts: Record<string, number> = {};

    coordinates.forEach(({ coordinates }) => {
        const point = turf.point([coordinates[1], coordinates[0]]);
        let matchedRegion: string | null = null;

        geoJson.features.forEach((feature) => {
            const { geometry, properties } = feature;
            const regionName = properties?.NAME_2 || properties?.name;

            if (!geometry || !regionName) return;
            if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon") return;

            if (geometry.type === "Polygon") {
                const polygon = turf.polygon(geometry.coordinates as number[][][]);
                if (turf.booleanPointInPolygon(point, polygon)) {
                    regionCounts[regionName] = (regionCounts[regionName] || 0) + 1;
                    matchedRegion = regionName;
                }
            } else if (geometry.type === "MultiPolygon") {
                geometry.coordinates.forEach((polygon) => {
                    const multiPolygon = turf.polygon(polygon as number[][][]);
                    if (turf.booleanPointInPolygon(point, multiPolygon)) {
                        regionCounts[regionName] = (regionCounts[regionName] || 0) + 1;
                        matchedRegion = regionName;
                    }
                });
            }
        });
    });

    return regionCounts;
};

export default function GeoJsonMap({ speciesCoordinates }: { speciesCoordinates: SpeciesCoordinate[] }) {
    const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
    const [regionData, setRegionData] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    const t = useTranslations("Regions")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const geoJsonTyped = data as GeoJSONData;
                setGeoData(geoJsonTyped);

                if (!speciesCoordinates || speciesCoordinates.length === 0) {
                    console.warn("⚠️ No species coordinates available.");
                    return;
                }

                const calculatedRegionData = calculateRegionDensity(geoJsonTyped, speciesCoordinates);
                setRegionData(calculatedRegionData);
                setLoading(false);  // ✅ Data is ready
            } catch (error) {
                setLoading(false);
            }
        };

        fetchData();
    }, [speciesCoordinates]);

    const getRegionStyle = (feature: Feature<Geometry, any> | undefined): PathOptions => {
        if (!feature || !feature.properties) return { color: "#0056b3", weight: 1.5, fillOpacity: 0.2 };

        const regionName = feature.properties.NAME_2 || feature.properties.name;
        const recordCount = regionData[regionName] || 0;
        const opacity = Math.min(0.2 + recordCount / 10, 0.8);

        return {
            color: "#0056b3",
            weight: 1.5,
            fillColor: recordCount > 0 ? "#004080" : "#cccccc",
            fillOpacity: opacity,
        };
    };

    const markers = speciesCoordinates.map(({ coordinates, title, slug }, index) => {
        let matchedRegion: string | null = null;
        const point = turf.point([coordinates[1], coordinates[0]]);

        geoData?.features.forEach((feature) => {
            const { geometry, properties } = feature;
            const regionName = properties?.NAME_2 || properties?.name;

            if (!geometry || !regionName) return;
            if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon") return;

            if (geometry.type === "Polygon") {
                const polygon = turf.polygon(geometry.coordinates as number[][][]);
                if (turf.booleanPointInPolygon(point, polygon)) {
                    matchedRegion = regionName;
                }
            } else if (geometry.type === "MultiPolygon") {
                geometry.coordinates.forEach((polygon) => {
                    const multiPolygon = turf.polygon(polygon as number[][][]);
                    if (turf.booleanPointInPolygon(point, multiPolygon)) {
                        matchedRegion = regionName;
                    }
                });
            }
        });

        if (loading || !geoData) {
            return <div className="text-center">Loading map...</div>;
        }

        return (
            <Marker
                key={index}
                position={[coordinates[0], coordinates[1]]}
                icon={L.divIcon({
                    className: `marker`,
                    html: `<div style="width: 10px; height: 10px; background: ${matchedRegion ? "red" : "black"}; border-radius: 50%;"></div>`,
                })}
            >
                <Popup>
                    <p className="text-sm"><span className="font-medium">{t("place")}</span>: {title}</p>
                    <p><span className="font-medium">{t("region")}</span>: {matchedRegion || "None"}</p>
                    <Link
                        // href={`/search?coordinates=${coordinates[0]},${coordinates[1]}`}
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
        if (!feature.properties) return;

        const regionName = feature.properties.NAME_2 || feature.properties.name;
        const recordCount = regionData[regionName as keyof typeof regionData] || 0;

        const pathLayer = layer as L.Path;
        pathLayer.options.interactive = true;

        layer.bindPopup(`<b>${t(`${regionName}`)}</b><br>${t("records")}: ${recordCount}`);

        layer.on("click", function (e) {
            layer.openPopup(e.latlng);
            e.originalEvent.stopPropagation();
        });
    };

    return (
        <MapContainer className="w-full h-[500px]" center={[41.8, 44.5]} zoom={7} scrollWheelZoom={false}>
            <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            />
            {geoData && (
                <GeoJSON
                    data={geoData}
                    style={(feature) => getRegionStyle(feature)}
                    onEachFeature={onEachRegion}
                />
            )}
            {markers}
        </MapContainer>
    );
}
