"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link, usePathname, useRouter } from "@/i18n/routing"

import { LocaleType } from "@/types/LanguageTypes"

const navigation = [
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
        title: "database",
        path: "/database"
    },
    {
        id: 4,
        title: "map",
        path: "/map"
    },
    {
        id: 5,
        title: "contribute",
        path: "/contribute"
    }
]


export function Navbar({locale}: {locale: LocaleType}) {
    const t = useTranslations("Navigation")

    return (
        <nav className="flex item-center justify-between">
            <LanguageSwitcher locale={locale} />
            <ul className="flex gap-3">
                {navigation.map((item) => (
                    <li key={item.id} className="text-lg">
                        <Link href={`/${item.path}`}>
                            {t(item.title)}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

const LanguageSwitcher = ({ locale }: {locale: any}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleLanguageChange = (lang: any) => {
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