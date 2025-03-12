import { Link } from "@/i18n/routing"
import { CopyrightIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

const currentDate = new Date().getFullYear()

const detectDate = () => {
    return currentDate > 2025 ? `2025 - ${currentDate}` : currentDate
}

export function Footer() {
    const t = useTranslations("Footer")
    return (
        <footer className="mt-auto bg-black text-white shadow-gray-300">
            <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between">
                <div className="text-sm flex flex-col text-center md:text-left gap-y-1 mb-4 md:mb-0 px-4 md:px-0">
                    <p className="flex items-center gap-1">
                    <CopyrightIcon className="w-3 h-3" /> {detectDate()}, {t("isu_full")}. {t("zoology")}
                    </p>
                    <p className="text-xs">{t("address")}. <Link href={`${t("url")}`}>{t("website")}</Link></p>
                    <p className="text-xs my-2">Developed @<Link href={"mailto:dh@iliauni.edu.ge"}>DH ISU</Link></p>
                </div>
                <Image 
                    src={"/iliauni-logo_eng.png"}
                    alt="ISU"
                    width={70}
                    height={70}
                    priority
                    className="invert brightness-0"
                />
            </div>
        </footer>
    )
}