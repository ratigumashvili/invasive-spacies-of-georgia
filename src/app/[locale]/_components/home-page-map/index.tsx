"use client"

import dynamic from "next/dynamic"

// const HomePageMap = dynamic(() => import("./home-page-map"), {
//     ssr: false
// })

// export default HomePageMap

const GeoJsonMap = dynamic(() => import("./geo-json-map"), {
    ssr: false
})

export default GeoJsonMap