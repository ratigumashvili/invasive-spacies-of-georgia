import Container from "@/app/[locale]/_components/container";
import { useTranslations } from "next-intl";

export function NothingFound ({text}: {text?: string}) {

    const t = useTranslations("Common")

    return (
        <Container>
            <h1 className="text-2xl font-medium">{t("nothing_found")}</h1>
            <h2 className="text-xl">{text}</h2>
        </Container>
    )
}