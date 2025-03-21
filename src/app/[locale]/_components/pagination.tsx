"use client"

import { useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pathname: string
}

export function Pagination({ currentPage, totalPages, pathname }: PaginationProps) {
    
    const router = useRouter()
    
    useEffect(() => {
        if(currentPage > totalPages) {
            router.push(`/${pathname}?page=${totalPages}`)
        }
        //eslint-disable-next-line
    }, [router])
    
    const createPageUrl = (page: number) => `/${pathname}?page=${page}`;
    
    const t = useTranslations("Common")
    
    if (totalPages <= 1) return null;

    return (
        <div className="flex mt-8 space-x-1">

            {currentPage > 1 && (
                <Link href={createPageUrl(currentPage - 1)} scroll={false} className="px-4 py-2 border rounded">
                    ← {t("prev")}
                </Link>
            )}

            {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return (
                    <Link 
                        key={page} 
                        scroll={false}
                        href={createPageUrl(page)}
                        className={`px-4 py-2 border rounded ${currentPage === page ? "bg-sky-800 text-white" : ""}`}
                    >
                        {page}
                    </Link>
                );
            })}

            {currentPage < totalPages && (
                <Link href={createPageUrl(currentPage + 1)} scroll={false} className="px-4 py-2 border rounded">
                    {t("next")} →
                </Link>
            )}
        </div>
    );
}
