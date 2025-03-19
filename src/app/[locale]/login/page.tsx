import Container from "@/app/[locale]/_components/container";
import { LoginForm } from "@/app/[locale]/_components/auth/login";

export default async function LoginPage() {
    return (
        <Container>
            <LoginForm />
        </Container>
    )
}