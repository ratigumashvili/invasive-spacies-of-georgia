"use client"

import { useRef } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { ClipboardCopyIcon } from "lucide-react"

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

    const ref = useRef<HTMLSpanElement | null>(null)
    const url = useFullUrl()

    function handleCopy () {
        navigator.clipboard.writeText(ref?.current?.innerText as string);
        toast.success("Citation copied to clipboard")
    }

    return (
        <div className="p-4 text-sm mt-4 border relative pr-[60px]">
            <span className="font-medium pr-1 print:hidden">Cite:</span>
            <span ref={ref}>
                {authors.map((author, index) => (
                    <span key={author.id}>{formatNameToCitationStyle(author.username)}{separator(index, authors, ", ", " ")}</span>
                ))} 2005. <em>{recordTitle}</em>, {recordAuthor} – FactSheet. {appTitle}, {appSubTitle} {appVersion}. Accessed at: {url}. Date accessed: {format(new Date(Date.now()), "PPP")}
            </span>
            <ClipboardCopyIcon className="w-4 h-4 absolute right-4 top-4 cursor-pointer print:hidden" onClick={handleCopy} />
        </div>
    )
}