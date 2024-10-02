import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Footer, Header } from "@/components/PageLayout";


export default function Layout() {

    return (
        <div className="flex h-screen w-full flex-col">
            <Header />
            <main className="flex grow flex-col overflow-scroll py-4">
                <Outlet />
                <Toaster />
            </main>
            <Footer />
        </div>
    );
}

