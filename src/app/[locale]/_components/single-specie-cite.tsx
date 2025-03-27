"use client"

import { format } from "date-fns"

import { useFullUrl } from "@/hooks/use-full-url"
import { formatNameToCitationStyle, separator } from "@/lib/utils"

import { User } from "@/types/specie-response"

interface SingleSpecieCiteProps {
    authors: User[],
    recordTitle: string,
    recordAuthor: string,
    appTitle: string,
    appSubTitle: string,
    appVersion: string,
}

export function SingleSpecieCite({
    authors,
    recordTitle,
    recordAuthor,
    appTitle,
    appSubTitle,
    appVersion,
}: SingleSpecieCiteProps) {

    const url = useFullUrl()

    return (
        <div className="p-4 text-sm mt-4 border">
            {authors.map((author, index) => (
                <span key={author.id}>{formatNameToCitationStyle(author.username)}{separator(index, authors, ", ", " ")}</span>
            ))} 2005. <em>{recordTitle}</em>, {recordAuthor} – FactSheet. {appTitle}, {appSubTitle} {appVersion}. Accessed at: {url}. Date accessed: {format(new Date(Date.now()), "PPP")}
        </div>
    )
}