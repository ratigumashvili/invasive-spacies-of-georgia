"use client"

import { useEffect, useState } from "react";
import { LayoutGridIcon, ListIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { isLocalStorageAvailable } from "@/lib/utils";

export function Views() {

    const [isActive, setIsActive] = useState<"grid" | "list">("grid");

    useEffect(() => {
        
        if (!isLocalStorageAvailable()) return;

        const storedView = localStorage.getItem("view");
        if (storedView === "list" || storedView === "grid") {
            setIsActive(storedView);
        }
    }, []);

    function handleViewChange(view: "list" | "grid") {
        localStorage.setItem("view", view);
        setIsActive(view);
      }

    return (
        <div className="flex gap-1">
            <Button
                className="cursor-pointer rounded-none"
                variant={isActive === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => handleViewChange("list")}
            >
                <ListIcon />
            </Button>
            <Button
                className="cursor-pointer rounded-none"
                variant={isActive === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => handleViewChange("grid")}
            >
                <LayoutGridIcon />
            </Button>
        </div>
    )
}