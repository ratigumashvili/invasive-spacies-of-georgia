"use client"

import { useAuth } from "@/hooks/use-auth";

import Container from "@/app/[locale]/_components/container";

export default function DashboardPage() {
    const { user, logout } = useAuth()

    return (
        <Container>
            <h1>Dashboard</h1>
            <button onClick={logout}>Logout</button>
            {user ? <p>Welcome, {user.username}!</p> : <p>Please log in.</p>}
        </Container>
    )
}