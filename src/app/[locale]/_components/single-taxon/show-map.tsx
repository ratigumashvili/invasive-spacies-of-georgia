"use client"

import dynamic from "next/dynamic"

const SingleTaxonMap = dynamic(() => import("./single-taxon-map"), {
    ssr: false
})

export default SingleTaxonMap