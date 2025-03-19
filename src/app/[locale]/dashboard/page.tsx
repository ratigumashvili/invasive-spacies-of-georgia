"use client"

import { Link } from "@/i18n/routing";
import { useAuth } from "@/context/auth-context";

import Container from "@/app/[locale]/_components/container";

export default function DashboardPage() {
    const { user, logout } = useAuth()

    return (
        <Container>
            <h1>Dashboard</h1>
            {user ? (
                <>
                    <p>Welcome, {user.username}!</p>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <p>Please <Link href={'/login'}>log in</Link>.</p>
                </>
            )}
        </Container>
    )
}