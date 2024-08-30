import { Authenticated } from "convex/react";
import type { ReactNode } from "react";

export function Toolbar({ children }: {
    children?: ReactNode;
}) {
    return <div className="mb-6">
        <Authenticated>
            <div className='absolute bottom-0 left-0 z-10 w-full py-4 px-0 bg-convex-purple border-b' >
                <div className="container dark">
                    {children}
                </div>
            </div>
        </Authenticated>
    </div>
}