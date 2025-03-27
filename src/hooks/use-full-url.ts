"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useFullUrl = () => {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    if (window && typeof window !== "undefined") {

      const query = searchParams.toString();
      const url = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;

      setFullUrl(url);
    }
  }, [pathname, searchParams]);

  return fullUrl;
};