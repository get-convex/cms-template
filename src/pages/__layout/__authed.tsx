import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function Authed() {
  return (
    <>
      <AuthLoading>
        <p className="container">Loading...</p>
      </AuthLoading>
      <Unauthenticated>
        <GoBack />
      </Unauthenticated>
      <Authenticated>
        <Outlet />
      </Authenticated>
    </>
  );
}

function GoBack() {
  const { pathname } = useLocation();
  const segments = pathname.split("/");
  const previous = segments.slice(0, -1).join("/");
  return <Navigate to={previous} />;
}
