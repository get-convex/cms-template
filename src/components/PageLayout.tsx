import { Link, useLocation } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { Search } from "@/components/Search";
import type { ReactNode } from "react";
import { GitHubLogoIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

function StarUsLink() {
    return <a href="https://github.com/get-convex/cms-template"
        target="_blank"
        rel="noreferrer"
        className={cn(
            buttonVariants({ variant: 'link', size: 'sm' }),
            'group flex gap-3 px-0 text-primary/80 hover:text-primary hover:no-underline',
        )}
    >
        <span className="flex lg:hidden"><GitHubLogoIcon /></span>
        <span className="hidden select-none items-center gap-1 rounded-full bg-green-500/5 px-2 py-1 pr-2.5 text-xs font-medium tracking-tight text-green-600 ring-1 ring-inset ring-green-600/20 backdrop-blur-sm dark:bg-yellow-800/40 dark:text-yellow-100 dark:ring-yellow-200/50 lg:flex">
            <StarFilledIcon
                className="h-3 w-3 text-green-600 dark:text-yellow-100"
                fill="currentColor"
            />
            Star us on GitHub
        </span>
    </a>
}


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
                    <StarUsLink />
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
            <FooterLink href="https://convex.dev/c/convexcmstemplate">Convex</FooterLink>.
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