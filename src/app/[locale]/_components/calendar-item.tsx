"use client"

import { generateFontByLocale } from "@/lib/utils"
import { useLocale } from "next-intl"

interface CalendarItemProps {
    start: string,
    end?: string,
    month: string,
    year: string
}

export function CalendarItem({start, end, month, year}: CalendarItemProps) {
    const locale = useLocale()
    return (
        <div className="w-[100px] flex flex-col relative overflow-hidden">
            <span className="absolute w-3 h-3 bg-white rounded-full -top-1.5 left-4" />
            <span className="absolute w-3 h-3 bg-white rounded-full -top-1.5 right-4" />
            <div className="flex-1 bg-sky-800 text-white text-center p-1 pt-3">
                <h2 className="text-3xl font-medium">{start}-{end}</h2>
                <p className={`${generateFontByLocale(locale)} uppercase`}>{month}</p>
            </div>
            <div className="bg-slate-100 text-center p-1">{year}</div>
        </div>
    )
}