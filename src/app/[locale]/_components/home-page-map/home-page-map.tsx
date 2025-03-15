"use client"

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { Icon, LatLngExpression } from 'leaflet'
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useTranslations } from 'next-intl';
import { TriangleAlertIcon } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"

import { useLocation } from '@/hooks/use-location';

const center = [42.021748359530285, 43.58942280074164]

const customIcon = new Icon({
    iconUrl: "/pin.png",
    iconSize: [28, 28]
})

const CustomButton = () => {
    const [isOpen, setIsOpen] = useState(false)

    const map = useMap();
    const t = useTranslations("Common")

    useEffect(() => {
        const customControl = new L.Control({ position: "topleft" });

        customControl.onAdd = () => {
            const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");

            const button = L.DomUtil.create("button", "", container);
            button.innerHTML = `&quest;`;
            button.style.fontWeight = "bold";
            button.style.fontSize = "16px";
            button.style.backgroundColor = "white";
            button.style.padding = "2px 9px";
            button.style.cursor = "pointer";
            button.style.border = "1px solid #ccc";
            button.style.borderRadius = "4px";

            button.onclick = () => {
                console.log("clicked")
                setIsOpen((prev) => !prev)
            };

            return container;
        };

        customControl.addTo(map);

        return () => {
            customControl.remove();
        };
    }, [map]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogTitle className='flex items-center gap-2'>
                    <TriangleAlertIcon /> {t("attention")}
                </DialogTitle>
                <DialogDescription className='sr-only'>
                    Modal description
                </DialogDescription>
                <p className='mt-2'>{t("map_description")} <Link href={"/species-list"} className='text-sky-800'>{t("map_read_more")}</Link></p>
            </DialogContent>
        </Dialog>
    );
};

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
        // eslint-disable-next-line
    }, [data]);

    return (
        <MapContainer
            className='w-full h-[400px] z-0'
            center={center as LatLngExpression}
            zoom={7}
            scrollWheelZoom={false}
        >
            {/* <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}
            <TileLayer 
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            />

            <CustomButton />

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
                                    className="block my-2 !text-sky-800 !hover:text-red-600 transition"
                                >
                                    {t("readMore")}
                                </Link>
                            )}
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    )
}