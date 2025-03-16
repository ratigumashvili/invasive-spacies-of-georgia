"use client"

import { Icon, LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useTranslations } from 'next-intl';

import { Place } from '@/types/taxonomy-types';

const center = [42.021748359530285, 43.58942280074164]

const customIcon = new Icon({
    iconUrl: "/pin.png",
    iconSize: [28, 28]
})

interface SingleTaxonMapProps {
    places: Place[];
}

export default function SingleTaxonMap({ places }: SingleTaxonMapProps) {

    const t = useTranslations("Common")

    return (
        <>
            <MapContainer
                className='w-full h-[400px] z-0'
                center={center as LatLngExpression}
                zoom={6}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup>
                    {places.map((marker) => (
                        <Marker
                            key={marker.documentId}
                            position={marker.coordinates.split(",").map(Number) as [number, number]}
                            icon={customIcon}
                        >
                            <Popup>
                                <h2 className='font-medium'>
                                    {marker.title}
                                </h2>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </>
    )
}