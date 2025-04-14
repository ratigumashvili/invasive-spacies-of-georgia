"use client"

import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { EllipsisIcon } from "lucide-react"

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
                <DropdownMenuItem className="text-base cursor-pointer" onClick={copyToClipboard}>
                    {t("copyUrl")}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base cursor-pointer">
                    {t("printPage")}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base cursor-pointer" onClick={() => exportDataAsCSV(specieData)}>
                    {t("speciesData")}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base cursor-pointer" onClick={() => exportDataAsCSV(distribution)}>
                    {t("distributionData")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}