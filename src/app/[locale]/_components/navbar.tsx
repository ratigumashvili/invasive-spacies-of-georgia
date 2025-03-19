"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { ChevronsRightIcon, LogOutIcon, MenuIcon, SearchIcon } from "lucide-react"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { cn, generateFontByLocale } from "@/lib/utils"

import { LocaleType } from "@/types/language-types"
import { useAuth } from "@/context/auth-context"


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
        title: "places_list",
        path: "/places"
    },
    {
        id: 5,
        title: "literature",
        path: "/literature"
    },
    {
        id: 6,
        title: "legal_docs",
        path: "legal-docs"
    },
    {
        id: 7,
        title: "research",
        path: "research"
    },
    {
        id: 8,
        title: "data_export",
        path: "data-export"
    },
    {
        id: 9,
        title: "statistics",
        path: "statistics"
    },
    {
        id: 10,
        title: "group",
        path: "group"
    },
    {
        id: 11,
        title: "contribute",
        path: "/contribute"
    }

]

export function Navbar({ locale }: { locale: LocaleType }) {
    const { user, logout } = useAuth()

    const t = useTranslations("Navigation")

    const router = useRouter()
    const pathname = usePathname()

    const hanldeButtonClick = (path: string) => {
        router.push(`/${path}`)
    }

    return (
        <header>
            <div className="bg-sky-800 text-white py-2">
                <nav className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-2 md:gap-y-0 mb-4 md:mb-0">
                        <div className="flex gap-x-2 items-center">
                            <ChevronsRightIcon className="w-4 h-4" />
                            <Link href={`${locale === "ka" ? "https://iliauni.edu.ge/ge" : "https://iliauni.edu.ge/en"}`}>{t("isu")}</Link>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <ChevronsRightIcon className="w-4 h-4" />
                            <Link href={"/register"}>{t("register")}</Link>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <ChevronsRightIcon className="w-4 h-4" />
                            <Link href={"/dashboard"}>{t("dashboard")}</Link>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <ChevronsRightIcon className="w-4 h-4" />
                            <Link href={"/bookmarked"}>{t("bookmarked")}</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <LanguageSwitcher locale={locale} />
                        <p className="flex items-center">
                            <SearchIcon className="w-4 h-4 mr-2" />
                            <Link href={"/search"}>{t("search")}</Link>
                        </p>
                    </div>
                </nav>
            </div>
            <div className="bg-sky-900 text-white shadow-lg shadow-gray-300">
                <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={"/"}>
                            <Image
                                src={'/iliauni-logo_eng.png'}
                                alt="ISU" width={90}
                                height={90}
                                className="block invert brightness-0"
                                priority
                            />
                        </Link>
                        <h1 className={cn(
                            "hidden sm:block text-2xl font-medium uppercase w-[350px]",
                            generateFontByLocale(locale)
                        )}>{t("isu_full")}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-0 focus:outline-0">
                                    <Avatar>
                                        <AvatarFallback
                                            className="bg-sky-950 cursor-pointer"
                                        >
                                            {user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-none">
                                    <DropdownMenuItem className="rounded-none">
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-2 cursor-pointer"
                                        >
                                           <LogOutIcon className="w-4 h-4" /> {t("logout")}
                                        </button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <></>
                        )}
                        <Sheet>
                            <SheetTrigger className="cursor-pointer">
                                <MenuIcon className="w-10 h-10" />
                            </SheetTrigger>
                            <SheetContent side="left" className="w-full">
                                <SheetHeader>
                                    <SheetTitle className="sr-only">{t("navigation")}</SheetTitle>
                                    <SheetDescription asChild>
                                        <nav className="flex flex-col gap-2 pt-6">
                                            {topMenu.map((item) => (
                                                <SheetClose asChild key={item.id}>
                                                    <Button
                                                        variant="ghost"
                                                        size="lg"
                                                        onClick={() => hanldeButtonClick(item.path as string)}
                                                        className="justify-start cursor-pointer"
                                                    >
                                                        <span className={cn(
                                                            `${generateFontByLocale(locale)} font-semibold text-lg uppercase text-black`,
                                                            pathname === item.path && "text-sky-800"
                                                        )}>
                                                            {t(item.title)}
                                                        </span>
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
            </div>
        </header>
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