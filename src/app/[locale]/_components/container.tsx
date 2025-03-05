import { cn } from "@/lib/utils";

export default function Container({children, className}: {children: React.ReactNode, className?: string}) {
    return (
        <section className={cn("w-full max-w-7xl mx-auto px-4 sm:px-8 py-8", className)}>
            {children}
        </section>
    )
}