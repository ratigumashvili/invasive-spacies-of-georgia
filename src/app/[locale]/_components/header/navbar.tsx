import { useTranslations } from "next-intl"
import Link from "next/link"

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

export function Navbar() {
    const t = useTranslations("Navigation")
    return (
        <nav>
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