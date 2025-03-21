"use client"

import { LayoutGridIcon, ListIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ViewsProps = {
    selectedView: "grid" | "list";
    setSelectedView: (view: "grid" | "list") => void;
  };

export function Views({ selectedView, setSelectedView }: ViewsProps) {

    function handleViewChange(view: "grid" | "list") {
        localStorage.setItem("view", view);
        setSelectedView(view);
      }

    return (
        <div className="flex gap-1">
            <Button
                className="cursor-pointer rounded-none"
                variant={selectedView === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => handleViewChange("list")}
            >
                <ListIcon />
            </Button>
            <Button
                className="cursor-pointer rounded-none"
                variant={selectedView === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => handleViewChange("grid")}
            >
                <LayoutGridIcon />
            </Button>
        </div>
    )
}