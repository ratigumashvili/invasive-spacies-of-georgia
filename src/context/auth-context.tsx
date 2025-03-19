"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

interface UserProps {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
}

interface AuthContextProps {
    user: UserProps | null;
    token: string | null;  // ✅ Add token to context
    login: (user: UserProps, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<UserProps | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedToken = Cookies.get("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (user: UserProps, token: string) => {
        Cookies.set("token", token, { expires: 7, secure: true, sameSite: "strict", path: "/" });
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
        setToken(token);
        toast.success("Logged in successfully!");
    };

    const logout = () => {
        Cookies.remove("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null); 
        toast.success("Logged out successfully!");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
