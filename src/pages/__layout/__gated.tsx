import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

export default function Gated() {
    const { pathname } = useLocation();
    const segments = pathname.split('/');
    const previous = segments.slice(0, -1).join('/');

    return <>
        <AuthLoading>
            <p className="container">Loading...</p>
        </AuthLoading>
        <Unauthenticated>
            <Navigate to={previous} replace />
        </Unauthenticated>
        <Authenticated>
            <Outlet />
        </Authenticated>
    </>
}
