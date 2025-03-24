"use client"

import { useTranslations } from "next-intl"

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
    { label: "specie" }
]

export function SearchComponent() {
    const t = useTranslations("Search")
    return (
        <Card className="rounded-none bg-slate-50">
            <CardHeader>
                <CardTitle className="text-xl">{t("search_for_species")}</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex items-center gap-2 mb-4">
                        <Input id="name" name="name" className="py-4 px-3 rounded-none bg-white" placeholder={t("placeholder_text")} />
                        <Button type="button" variant="destructive" className="rounded-none cursor-pointer">{t("cancel")}</Button>
                        <Button type="button" className="rounded-none cursor-pointer">{t("submit")}</Button>
                    </div>
                    <div>
                        <RadioGroup defaultValue="specie" className="flex items-center gap-2">
                            {taxonomy.map((item) => (
                                <div key={item.label} className="flex gap-x-2">
                                    <RadioGroupItem value={item.label} id={item.label} className="bg-white" />
                                    <Label htmlFor={item.label}>{t(item.label)}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}