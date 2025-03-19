"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { generateFontByLocale } from "@/lib/utils";
import { registerUser } from "@/lib/api-calls";


export function RegisterUser() {
    const locale = useLocale();
    const t = useTranslations("Common");
    const router = useRouter();

    const registerSchema = z.object({
        name: z.string().min(4, t("validate_name")),
        email: z.string().email(t("validate_email")),
        password: z.string().min(6, t("validate_password")),
    });

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    async function handleFormSubmit(values: any) {
        const response = await registerUser(values.name, values.email, values.password);

        if (response.status === "success") {
            toast.success(t("register_success"));
            router.push("/login");
        } else {
            toast.error(response.data);
        }
    }

    return (
        <div className="w-full max-w-[450px]">
            <h1 className={`${generateFontByLocale(locale)} text-2xl uppercase font-medium mb-8`}>
                {t("registration")}
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("name")}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={t("enter_your_name")}
                                        className="rounded-none px-3 py-6 text-base"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("email")}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={t("enter_your_email")}
                                        className="rounded-none px-3 py-6 text-base"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("password")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        {...field}
                                        placeholder={t("enter_your_password")}
                                        className="rounded-none px-3 py-6 text-base"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="rounded-none my-4 py-6 cursor-pointer">
                        {t("submit")}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
