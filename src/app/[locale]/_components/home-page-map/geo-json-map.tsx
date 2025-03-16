"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import * as turf from "@turf/turf";
import L, { PathOptions } from "leaflet";
import data from "@/app/[locale]/_data/coords.json";
import { Feature, Geometry } from "geojson";

type GeoJSONFeature = Feature<Geometry, { NAME_2?: string; name?: string }>;
type GeoJSONData = { type: "FeatureCollection"; features: GeoJSONFeature[] };
type Coordinate = [number, number];

const calculateRegionDensity = (geoJson: GeoJSONData, coordinates: Coordinate[]) => {
    const regionCounts: Record<string, number> = {};

    coordinates.forEach((coord) => {
        const point = turf.point([coord[1], coord[0]]);
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

        console.log(`📌 Coordinate [${coord[0]}, ${coord[1]}] → Matched Region: ${matchedRegion || "None"}`);
    });

    console.log("✅ Final Region Counts:", regionCounts);
    return regionCounts;
};

export default function GeoJsonMap({ speciesCoordinates }: { speciesCoordinates: Coordinate[] }) {
    const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
    const [regionData, setRegionData] = useState<Record<string, number>>({});

    useEffect(() => {
        const geoJsonTyped = data as GeoJSONData;
        setGeoData(geoJsonTyped);
        const calculatedRegionData = calculateRegionDensity(geoJsonTyped, speciesCoordinates);
        setRegionData(calculatedRegionData);
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

    const markers = speciesCoordinates.map((coord, index) => {
        let matchedRegion: string | null = null;
        const point = turf.point([coord[1], coord[0]]);

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

        return (
            <Marker
                key={index}
                position={[coord[0], coord[1]]}
                icon={L.divIcon({
                    className: `marker`,
                    html: `<div style="width: 10px; height: 10px; background: ${matchedRegion ? "red" : "black"}; border-radius: 50%;"></div>`,
                })}
            >
                <Popup>
                    <b>Coordinate:</b> [{coord[0]}, {coord[1]}] <br />
                    <b>Matched Region:</b> {matchedRegion || "None"}
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
    
        layer.bindPopup(`<b>${regionName}</b><br>Records: ${recordCount}`);
    
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
