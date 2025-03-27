"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFullUrl } from "@/hooks/use-full-url"
import { exportDataAsCSV } from "@/lib/utils"
import { DistributionDownload, SpecieDownload } from "@/types/specie-response"
import { SettingsIcon } from "lucide-react"
import { toast } from "sonner"

export function DropDownAction({
    specieData, 
    distribution
}: {
    specieData: SpecieDownload, 
    distribution: DistributionDownload[]
}) {

    const url = useFullUrl()

    function copyToClipboard () {
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="cursor-pointer p-2 focus:outline-0 print:hidden">
                    <SettingsIcon className="w-5 h-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white z-10 min-w-[200px] rounded-none" align="end">
                <DropdownMenuItem className="text-base cursor-pointer rounded-none" onClick={copyToClipboard}>
                    Copy url
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base cursor-pointer rounded-none">Print page</DropdownMenuItem>
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