"use client"

import { useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const taxonomy = [
    { label: "kingdom" },
    { label: "phylum" },
    { label: "class" },
    { label: "order" },
    { label: "family" },
    { label: "genus" },
    { label: "species" }
]

export function SearchComponent() {
    const t = useTranslations("Search")

    const formRef = useRef<HTMLFormElement | null>(null)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const defaultValue = searchParams.get("type") || "species"

    function handleFormSubmit(formData: FormData) {
        const name = formData.get("name")?.toString().trim();
        const type = formData.get("type")?.toString()

        if (!name) return

        router.push(`/search?name=${encodeURIComponent(name)}&type=${type}`)
    }

    function handleResetForm() {
        router.push(pathname, { scroll: false })
    }

    return (
        <Card className="shadow-none rounded-md">
            <CardHeader>
                <CardTitle className="text-xl">{t("search_for_species")}</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={handleFormSubmit} ref={formRef}>
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-2 mb-4">
                        <Input
                            id="name"
                            name="name"
                            className="py-5 px-3 text-base placeholder:text-base bg-white !focus:outline-0 !focus:ring-0 focus-visible:ring-0"
                            placeholder={t("placeholder_text")}
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleResetForm}
                            className="py-5 cursor-pointer w-full md:w-max"
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            variant="blue"
                            type="submit"
                            className="py-5 cursor-pointer w-full md:w-max">
                            {t("submit")}
                        </Button>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <RadioGroup defaultValue={defaultValue} name="type" className="flex flex-wrap items-center gap-2">
                            {taxonomy.map((item) => (
                                <div key={item.label} className="flex items-center gap-x-2" role="radiogroup">
                                    <RadioGroupItem value={item.label} id={item.label} className="bg-white" />
                                    <Label htmlFor={item.label} className="text-base">{t(item.label)}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}