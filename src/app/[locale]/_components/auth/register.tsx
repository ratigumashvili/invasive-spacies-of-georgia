"use client"

import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"
import { useRouter } from "@/i18n/routing"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { generateFontByLocale } from "@/lib/utils"
import { registerUser } from "@/lib/api-calls"

export function RegisterUser() {

    const locale = useLocale()
    const t = useTranslations("Common")
    const router = useRouter()

    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {

        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const response = await registerUser(name, email, password)

        if (response.status === "success") {
            toast.success("Registration successful")
            router.push('/login')
        } else {
            toast.error(response.data)
        }
    }

    return (
        <div className="w-full max-w-[450px]">
            <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium mb-8`}>
                {t("registration")}
            </h1>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-y-4">
                <Label htmlFor="name">{t("name")}</Label>
                <Input type="text" id="name" name="name" placeholder={t("enter_your_name")} className="rounded-none" />
                <Label htmlFor="email">{t("email")}</Label>
                <Input type="email" id="email" name="email" placeholder={t("enter_your_email")} className="rounded-none" />
                <Label htmlFor="password">{t("password")}</Label>
                <Input type="password" id="password" name="password" placeholder={t("enter_your_password")} className="rounded-none" />
                <Button className="rounded-none my-4">{t("submit")}</Button>
            </form>
        </div>
    )
}