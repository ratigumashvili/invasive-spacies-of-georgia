"use client"

import { useEffect, useState } from 'react';
import { Icon, LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from "react-leaflet-markercluster";

import { useLocation } from '@/hooks/use-location';

import "leaflet/dist/leaflet.css";
import 'react-leaflet-markercluster/styles'

const center = [42.021748359530285, 43.58942280074164]

const customIcon = new Icon({
    iconUrl: "/pin.png",
    iconSize: [28, 28]
})

export default function HomePageMap({ data }: { data: [number, number][] }) {
    const { getAddressFromCoordinates } = useLocation()

    const [markerAddresses, setMarkerAddresses] = useState<{ [key: string]: string | null }>({});

    useEffect(() => {
        const fetchAddresses = async () => {
            const newAddresses: { [key: string]: string | null } = {};

            for (const marker of data) {
                const key = `${marker[0]},${marker[1]}`;
                if (!markerAddresses[key]) {
                    const address = await getAddressFromCoordinates(marker[0], marker[1]);
                    newAddresses[key] = address;
                }
            }

            setMarkerAddresses((prev) => ({ ...prev, ...newAddresses }));
        };

        fetchAddresses();
    }, [data]);

    return (
        <>
            <MapContainer
                className='w-full h-full min-h-[500px] z-0'
                center={center as LatLngExpression}
                zoom={7}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MarkerClusterGroup>
                    {data.map((marker, index) => (
                        <Marker
                            key={index}
                            position={marker}
                            icon={customIcon}
                        >
                            <Popup>
                                {markerAddresses[`${marker[0]},${marker[1]}`] || "Loading address..."}
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>

            </MapContainer>
        </>
    )
}