import Container from "@/app/[locale]/_components/container";
import { RegisterUser } from "@/app/[locale]/_components/auth/register";

export default async function RegisterPage() {
    return (
        <Container>
            <RegisterUser />
        </Container>
    )
}