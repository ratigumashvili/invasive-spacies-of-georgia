"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportDataAsCSV } from "@/lib/utils"
import { SpecieDownload } from "@/types/specie-response"
import { SettingsIcon } from "lucide-react"

export function DropDownAction({csvData}: {csvData: SpecieDownload}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="cursor-pointer p-2 focus:outline-0">
                    <SettingsIcon className="w-5 h-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white z-10 min-w-[200px]" align="end">
                <DropdownMenuItem className="text-base cursor-pointer">Copy url</DropdownMenuItem>
                <DropdownMenuItem className="text-base cursor-pointer">Print page</DropdownMenuItem>
                <DropdownMenuItem className="text-base cursor-pointer" onClick={() => exportDataAsCSV(csvData)}>
                    Download data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-base cursor-pointer">Feedback</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}