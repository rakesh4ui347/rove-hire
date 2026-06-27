import Link from "next/link";

interface PageBackProps {
    href: string;
    label: string;
}

export function PageBack({
    href,
    label
}: PageBackProps) {
    return (
        <Link
            href={href}
            className="text-sm text-muted transition-colors hover:text-foreground"
        >
            ← {label}
        </Link>
    );
}