"use client"

import { useAuth } from "@/hooks/use-auth";

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
                    <p>Please log in.</p>
                </>
            )}
        </Container>
    )
}