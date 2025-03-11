"use client"

import { Link } from "@/i18n/routing"
import { generateFontByLocale } from "@/lib/utils"
import { MapPinIcon } from "lucide-react"
import { useLocale } from "next-intl"

interface CalendarItemProps {
    id: string,
    start: number,
    end?: number,
    startMonth: string,
    endMonth?: string,
    year: number,
    title: string,
    location: string
}

export function CalendarItem({ id, start, end, startMonth, endMonth, year, title, location }: CalendarItemProps) {
    const locale = useLocale()
    return (
        <div className="flex gap-2">
            <div className="w-[100px] min-w-[100px] flex flex-col mb-4 relative overflow-hidden">
                <span className="absolute w-3 h-3 bg-white rounded-full -top-1.5 left-5" />
                <span className="absolute w-3 h-3 bg-white rounded-full -top-1.5 right-5" />
                <div className="flex-1 bg-sky-800 text-white text-center p-1 pt-3">
                    <h2 className="text-2xl font-medium">{start}-{end}</h2>
                    <p className={`${generateFontByLocale(locale)} uppercase`}>{endMonth ? startMonth + "-" + endMonth : startMonth}</p>
                </div>
                <div className="bg-slate-200 text-center p-1">{year}</div>
            </div>
            <div>
                <h2 className="mb-2 line-clamp-2"><Link href={`/events/${id}`} className="link">{title}</Link></h2>
                <p className="flex items-center gap-2 text-sm">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{location}</span>
                </p>
            </div>
        </div>
    )
}