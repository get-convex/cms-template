import { ConvexAuthProvider } from "@convex-dev/auth/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { ConvexReactClient } from "convex/react";
import { BrowserRouter, useRoutes } from 'react-router-dom'
import Layout from "@/pages/__layout";
import "./index.css";

//@ts-expect-error
import routes from '~react-pages';

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL! as string;
console.log(CONVEX_URL);
const convex = new ConvexReactClient(CONVEX_URL);



function RouterApp() {
  return (
    <React.Suspense fallback={Layout()}>
      {useRoutes(routes)}
    </React.Suspense>
  )
}


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class">
      <BrowserRouter>
        <ConvexAuthProvider client={convex}>
          <RouterApp />
        </ConvexAuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
