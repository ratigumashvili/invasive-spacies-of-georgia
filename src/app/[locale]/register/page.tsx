"use client"

import Container from "@/app/[locale]/_components/container";
import { RegisterUser } from "../_components/auth/register";
import { LoginForm } from "../_components/auth/login";

export default function RegisterPage() {
    return (
        <Container>
            <RegisterUser />
            <br /><br />
            <br /><br />
            <LoginForm />
        </Container>
    )
}