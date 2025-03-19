"use client"

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

interface userProps {
    id: number,
    documentId: string,
    username: string,
    email: string,
    provider: string,
    confirmed: boolean,
    blocked: boolean,
    createdAt: Date,
    updatedAt: Date,
    publishedAt: Date
}

export function useAuth() {
    const router = useRouter()
    
    const [user, setUser] = useState<userProps | null>(null);

    useEffect(() => {
        const token = Cookies.get("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const logout = () => {
        Cookies.remove("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully!");
        router.push("/");
    };

    return { user, logout };
}
