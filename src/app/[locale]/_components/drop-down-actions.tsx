"use client"

import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { EllipsisIcon, FileTextIcon, Link2Icon, MapPinnedIcon, PrinterIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
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

    const t = useTranslations("Common")

    const url = useFullUrl()

    function copyToClipboard() {
        navigator.clipboard.writeText(url)
        toast.success(t("copied"))
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
            <DropdownMenuContent className="bg-white z-10 min-w-[200px]" align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={copyToClipboard}>
                    <Link2Icon className="w-4 h-4 mr-2" /> {t("copyUrl")}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <PrinterIcon className="w-4 h-4 mr-2" /> {t("printPage")}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => exportDataAsCSV(specieData)}>
                    <FileTextIcon className="w-4 h-4 mr-2" /> {t("speciesData")}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => exportDataAsCSV(distribution)}>
                    <MapPinnedIcon className="w-4 h-4 mr-2" /> {t("distributionData")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}