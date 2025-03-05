"use client"

import dynamic from "next/dynamic"

const HomePageMap = dynamic(() => import("./home-page-map"), {
    ssr: false
})

export default HomePageMap