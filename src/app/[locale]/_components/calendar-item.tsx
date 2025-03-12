"use client"

import { MapPinIcon } from "lucide-react"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"

import { generateFontByLocale } from "@/lib/utils"

import { EventItem } from "@/types/event-item"

export function CalendarItem({ slug, startDate, endDate, startMonth, endMonth, year, title, location }: EventItem) {
    const locale = useLocale()
    return (
        <div className="flex gap-2">
            <div className="w-[100px] min-w-[100px] flex flex-col mb-4 relative overflow-hidden">
                <span className="absolute w-3 h-3 bg-white rounded-full -top-1.5 left-5" />
                <span className="absolute w-3 h-3 bg-white rounded-full -top-1.5 right-5" />
                <div className="flex-1 bg-sky-800 text-white text-center p-1 pt-3">
                    <h2 className="text-2xl font-medium">{startDate}-{endDate}</h2>
                    <p className={`${generateFontByLocale(locale)} uppercase font-bold`}>{endMonth ? startMonth.slice(0, 3) + "-" + endMonth.slice(0, 3) : startMonth.slice(0, 3)}</p>
                </div>
                <div className="bg-slate-200 text-center p-1">{year}</div>
            </div>
            <div>
                <h2 className="mb-2 line-clamp-2">
                    <Link href={`/events/${slug}`} className="link">{title}</Link>
                </h2>
                <p className="flex items-center gap-2 text-sm">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{location}</span>
                </p>
            </div>
        </div>
    )
}