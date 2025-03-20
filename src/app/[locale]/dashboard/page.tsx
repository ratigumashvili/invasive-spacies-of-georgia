"use client"

import { Link } from "@/i18n/routing";
import { useAuth } from "@/context/auth-context";

import Container from "@/app/[locale]/_components/container";
import { CreateSpecieForm } from "../_components/create-specie-form";

export default function DashboardPage() {
    const { user } = useAuth()

    return (
        <Container>
            <h1>Dashboard</h1>
            {user ? (
                <>
                    <p>Welcome, {user.username}!</p>
                    <CreateSpecieForm />
                </>
            ) : (
                <>
                    <p>Please <Link href={'/login'}>log in</Link>.</p>
                </>
            )}
        </Container>
    )
}