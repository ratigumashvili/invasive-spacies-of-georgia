"use client"

import Cookies from "js-cookie";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginUser } from "@/lib/api-calls";
import { generateFontByLocale } from "@/lib/utils";

export function LoginForm() {
    const locale = useLocale()
    const t = useTranslations("Common")
    const router = useRouter()

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const response = await loginUser(email, password);
       
        if (response.status === "success") {
            const { jwt, user } = response.data;
            
            Cookies.set("token", jwt, { 
                expires: 7, 
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/"
            });

            localStorage.setItem("user", JSON.stringify(user));

            toast.success("Login successful!");
            
            router.replace(`/dashboard`)
        } else {
            toast.error(response.data);
        }
    };

    return (
        <div className="w-full max-w-[450px]">
            <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium mb-8`}>
                {t("login")}
            </h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-y-4">
                <Label htmlFor="email">{t("email")}</Label>
                <Input type="email" id="email" name="email" placeholder={t("enter_your_email")} className="rounded-none" />
                <Label htmlFor="password">{t("password")}</Label>
                <Input type="password" id="password" name="password" placeholder={t("enter_your_password")} className="rounded-none" />
                <Button className="rounded-none my-4">
                    {t("login")}
                </Button>
            </form>
        </div>
    );
}