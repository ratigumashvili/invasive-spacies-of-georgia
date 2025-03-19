"use client"

import Container from "@/app/[locale]/_components/container";

import { useAuth } from "@/context/auth-context";

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