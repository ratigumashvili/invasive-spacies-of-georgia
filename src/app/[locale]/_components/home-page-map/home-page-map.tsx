"use client"

import { Icon, LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from "react-leaflet-markercluster";

import "leaflet/dist/leaflet.css";
import 'react-leaflet-markercluster/styles'

const center = [42.021748359530285, 43.58942280074164]

const customIcon = new Icon({
    iconUrl: "/pin.png",
    iconSize: [28, 28]
})

export default function HomePageMap({ data }: { data: [number, number][] }) {
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
                            <Popup>Hello</Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>

            </MapContainer>
        </>
    )
}