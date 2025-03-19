"use client"

import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginUser } from "@/lib/api-calls";
import { generateFontByLocale } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

export function LoginForm() {

    const locale = useLocale()
    const t = useTranslations("Common")
    const router = useRouter()

    const { login } = useAuth();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const response = await loginUser(email, password);

        if (response.status === "success") {
            const { jwt, user } = response.data;
            login(user, jwt);

            router.push(`/dashboard`);
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
                <Input type="email" id="email" name="email" placeholder={t("enter_your_email")} className="rounded-none px-3 py-6 text-base" />
                <Label htmlFor="password">{t("password")}</Label>
                <Input type="password" id="password" name="password" placeholder={t("enter_your_password")} className="rounded-none px-3 py-6 text-base" />
                <Button className="rounded-none my-4 py-6 cursor-pointer">
                    {t("login")}
                </Button>
            </form>
        </div>
    );
}