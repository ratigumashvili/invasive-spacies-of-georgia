"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { ChevronsRightIcon, MenuIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link, usePathname, useRouter } from "@/i18n/routing"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import { LocaleType } from "@/types/language-types"


const topMenu = [
    {
        id: 1,
        title: "home",
        path: "/"
    },
    {
        id: 2,
        title: "about",
        path: "/about"
    },
    {
        id: 3,
        title: "species_list",
        path: "/species-list"
    },
    {
        id: 4,
        title: "literature",
        path: "/literature"
    },
    {
        id: 5,
        title: "legal_docs",
        path: "legal-docs"
    },
    {
        id: 6,
        title: "research",
        path: "research"
    },
    {
        id: 7,
        title: "data_export",
        path: "data-export"
    },
    {
        id: 8,
        title: "statistics",
        path: "statistics"
    },
    {
        id: 9,
        title: "group",
        path: "group"
    },
    {
        id: 10,
        title: "contribute",
        path: "/contribute"
    }

]


export function Navbar({ locale }: { locale: LocaleType }) {
    const t = useTranslations("Navigation")

    const router = useRouter()

    const hanldeButtonClick = (path: string) => {
        router.push(`/${path}`)
    }

    return (
        <>
            <div className="bg-red-700 text-white py-2">
                <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="flex items-center gap-x-2">
                        <ChevronsRightIcon className="w-4 h-4" />
                        <Link href={`${locale === "ka" ? "https://iliauni.edu.ge/ge" : "https://iliauni.edu.ge/en"}`}>{t("isu")}</Link>
                        <ChevronsRightIcon className="w-4 h-4" />
                        <Link href={"/register"}>{t("register")}</Link>
                        <ChevronsRightIcon className="w-4 h-4" />
                        <Link href={"/dashboard"}>{t("dashboard")}</Link>
                        <ChevronsRightIcon className="w-4 h-4" />
                        <Link href={"/bookmarked"}>{t("bookmarked")}</Link>
                    </div>
                    <div>
                        <LanguageSwitcher locale={locale} />
                    </div>
                </div>
            </div>
            <div className="bg-red-800 text-white shadow-lg shadow-gray-300">
                <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={"/"}>
                            <Image
                                src={'/iliauni-logo_eng.png'}
                                alt="ISU" width={100}
                                height={100}
                                className="block invert brightness-0"
                            />
                        </Link>
                        <h1 className="text-3xl font-semibold uppercase w-[400px]">{t("isu_full")}</h1>
                    </div>
                    <Sheet>
                        <SheetTrigger className="cursor-pointer">
                            <MenuIcon className="w-10 h-10" />
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle className="sr-only">{t("navigation")}</SheetTitle>
                                <SheetDescription asChild>
                                    <nav className="flex flex-col gap-2 pt-4">
                                        {topMenu.map((item) => (
                                            <SheetClose asChild key={item.id}>
                                                <Button
                                                    variant="ghost"
                                                    size="lg"
                                                    onClick={() => hanldeButtonClick(item.path as string)}
                                                    className="justify-start cursor-pointer"
                                                >
                                                    <span className="text-lg text-black">{t(item.title)}</span>
                                                </Button>
                                            </SheetClose>
                                        ))}
                                    </nav>
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </>
    )
}

const LanguageSwitcher = ({ locale }: { locale: LocaleType }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleLanguageChange = (lang: string) => {
        router.replace(pathname + "?" + searchParams, { locale: lang });
    };

    return (
        <div className="flex gap-2 items-center font-firaGo">
            {locale === "ka" ? (
                <>
                    <div className="switch justify-end" onClick={() => handleLanguageChange("en")}>
                        <div className="switch-circle"></div>
                    </div>
                    <button onClick={() => handleLanguageChange("en")}>English</button>
                </>
            ) : (
                <>
                    <div className="switch justify-start" onClick={() => handleLanguageChange("ka")}>
                        <div className="switch-circle"></div>
                    </div>
                    <button onClick={() => handleLanguageChange("ka")}>ქართული</button>
                </>
            )}
        </div>
    );
};