"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EllipsisIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useFullUrl } from "@/hooks/use-full-url"
import { exportDataAsCSV } from "@/lib/utils"

import { DistributionDownload, SpecieDownload } from "@/types/specie-response"

export function DropDownAction({
    specieData,
    distribution
}: {
    specieData: SpecieDownload,
    distribution: DistributionDownload[]
}) {

    const url = useFullUrl()

    function copyToClipboard() {
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer px-4 print:hidden shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                >

                    <EllipsisIcon className="w-7 h-7" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white z-10 min-w-[200px] rounded-none" align="end">
                <DropdownMenuItem className="text-base cursor-pointer rounded-none" onClick={copyToClipboard}>
                    Copy url
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base cursor-pointer rounded-none">
                    Print page
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base cursor-pointer rounded-none" onClick={() => exportDataAsCSV(specieData)}>
                    Download specie data
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base cursor-pointer rounded-none" onClick={() => exportDataAsCSV(distribution)}>
                    Download distribution data
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}