"use client"

import dynamic from "next/dynamic"

const GeoJsonMap = dynamic(() => import("./geo-json-map"), {
    ssr: false
})

export default GeoJsonMap