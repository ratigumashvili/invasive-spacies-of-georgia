import { LocaleType } from "@/types/language-types";
import { Navbar } from "./navbar";

export function Header({locale}: {locale: LocaleType}) {
    return (
        <header>
            <Navbar locale={locale} />
        </header>
    )
}