"use client"

import { LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css";

const center = [42.021748359530285, 43.58942280074164]

export default function HomePageMap() {
    return (
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
        </MapContainer>
    )
}