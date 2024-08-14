import { useQuery, Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function () {

    return <>
        <AuthLoading>
            <p className="container">Loading...</p>
        </AuthLoading>
        <Unauthenticated>
            <GoBack />
        </Unauthenticated>
        <Authenticated>
            <EditorOnly />
        </Authenticated>
    </>
}

function EditorOnly() {
    const editor = useQuery(api.authors.viewer);
    return (editor === null ? <GoBack /> : <Outlet />);
}

function GoBack() {
    const { pathname } = useLocation();
    const segments = pathname.split('/');
    const previous = segments.slice(0, -1).join('/');
    return <Navigate to={previous} />
}   
