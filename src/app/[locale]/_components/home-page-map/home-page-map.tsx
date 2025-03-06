"use client"

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { Icon, LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useTranslations } from 'next-intl';

import { useLocation } from '@/hooks/use-location';

const center = [42.021748359530285, 43.58942280074164]

const customIcon = new Icon({
    iconUrl: "/pin.png",
    iconSize: [28, 28]
})

export default function HomePageMap({ data }: { data: [number, number][] }) {

    const [markerAddresses, setMarkerAddresses] = useState<{ [key: string]: string | null }>({});

    const { getAddressFromCoordinates } = useLocation()

    const t = useTranslations("Common")

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
                className='w-full h-[550px] z-0'
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
                                {markerAddresses[`${marker[0]},${marker[1]}`] || t("loading")}

                                {markerAddresses[`${marker[0]},${marker[1]}`] && (
                                    <Link
                                        href={`/search?coordinates=${marker}`}
                                        className="block my-2 !text-red-700 underline"
                                    >
                                        {t("readMore")}
                                    </Link>
                                )}
                            </Popup>

                        </Marker>
                    ))}
                </MarkerClusterGroup>

            </MapContainer>
        </>
    )
}