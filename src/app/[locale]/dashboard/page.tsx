"use client"

import { Link } from "@/i18n/routing";
import { useAuth } from "@/context/auth-context";

import Container from "@/app/[locale]/_components/container";
import { CreateSpecieForm } from "../_components/create-specie-form";
import { useLocale, useTranslations } from "next-intl";
import { generateFontByLocale } from "@/lib/utils";

export default function DashboardPage() {
    const { user } = useAuth()
    const locale = useLocale()
    const t = useTranslations("Dashboard")

    return (
        <Container>
            <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium mb-8`}>
                {t("page_title")}
            </h1>
            {user ? (
                <>
                    <p>Welcome, {user.username}!</p>
                    <CreateSpecieForm />
                </>
            ) : (
                <>
                    <p>{t("please")} <Link className="font-medium text-sky-800" href={"/register"}>{t("register")}</Link> {t("or")} <Link className="font-medium text-sky-800" href={'/login'}>{t("sign_in")}</Link> {t("view")}</p>
                </>
            )}
        </Container>
    )
}