import { Link, useLocation } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { Search } from "@/components/Search";
import type { ReactNode } from "react";


export function Header() {
    const location = useLocation();
    return <header className="sticky top-0 z-10 flex min-h-20 border-b bg-background/80 backdrop-blur">
        <nav className="container w-full justify-between flex flex-row items-center gap-6">
            <div className="flex items-center gap-6 md:gap-10">
                <Link to="/">
                    <h1 className="text-3xl font-semibold">Convex Blog</h1>
                </Link>
                <div className="flex items-center gap-4 text-sm">
                    <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">Posts</Link>
                    <Link to="/authors" className="text-muted-foreground transition-colors hover:text-foreground">Authors</Link>
                    <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
                </div>
            </div>

            {location.pathname === '/' && <Search />}

            <UserMenu />
        </nav>
    </header>
}

export function Footer() {
    return <footer className="border-t hidden sm:block">
        <div className="container py-4 text-sm leading-loose">
            Built with ❤️ at{" "}
            <FooterLink href="https://www.convex.dev/">Convex</FooterLink>.
            Powered by Convex,{" "}
            <FooterLink href="https://vitejs.dev">Vite</FooterLink>,{" "}
            <FooterLink href="https://react.dev/">React</FooterLink> and{" "}
            <FooterLink href="https://ui.shadcn.com/">shadcn/ui</FooterLink>.
        </div>
    </footer>
}


function FooterLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <a
            href={href}
            className="underline underline-offset-4 hover:no-underline"
            target="_blank"
        >
            {children}
        </a>
    );
}