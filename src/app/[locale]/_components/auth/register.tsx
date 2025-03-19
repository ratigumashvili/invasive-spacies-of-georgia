"use client"

import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { generateFontByLocale } from "@/lib/utils"
import { registerUser } from "@/lib/api-calls"

export function RegisterUser() {

    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {

        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const response = await registerUser(name, email, password)

        if (response.status === "success") {
            toast.success("Registration successful")
        } else {
            toast.error(response.data)
        }
    }

    const locale = useLocale()
    const t = useTranslations("Common")

    return (
        <div className="w-full max-w-[450px]">
            <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium mb-8`}>
                {t("registration")}
            </h1>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-y-4">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" placeholder="Enter your name" className="rounded-none" />
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" placeholder="Enter your email" className="rounded-none" />
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password" placeholder="Enter your password" className="rounded-none" />
                <Button className="rounded-none">Submit</Button>
            </form>
        </div>
    )
}