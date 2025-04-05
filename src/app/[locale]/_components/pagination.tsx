"use client";

import { useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pathname: string;
  query?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, pathname, query = {} }: PaginationProps) {
  const router = useRouter();
  const t = useTranslations("Common");

  useEffect(() => {
    if (currentPage > totalPages) {
      const searchParams = new URLSearchParams({
        ...query,
        page: totalPages.toString()
      });

      router.push(`/${pathname}?${searchParams.toString()}`);
    }
    // eslint-disable-next-line
  }, [router]);

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const searchParams = new URLSearchParams({
      ...query,
      page: page.toString()
    });

    return `/${pathname}?${searchParams.toString()}`;
  };

  return (
    <div className="flex mt-8 space-x-1">
      {currentPage > 1 && (
        <Link href={createPageUrl(currentPage - 1)} scroll={false} className="px-4 py-2 bg-white rounded-sm">
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
            className={`px-4 py-2 rounded-sm ${currentPage === page ? "bg-sky-950 text-white" : "bg-white text-sky-950"}`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link href={createPageUrl(currentPage + 1)} scroll={false} className="px-4 py-2 bg-white rounded-sm">
          {t("next")} →
        </Link>
      )}
    </div>
  );
}
