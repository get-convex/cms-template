import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function PageTitle({ title, tagline }:
    { title: string, tagline?: string }) {

    const location = useLocation;
    useEffect(() => {
        document.title = `Convex CMS${title ? ` | ${title}` : ''}`;
    }, [location, title])

    return (<div className="flex flex-col gap-2">
        {title &&
            <h1 className="text-xl font-semibold sm:text-2xl lg:text-4xl py-2">{title}</h1>}
        {tagline && <p className="sm:block text-sm text-muted-foreground py-2">
            {tagline}
        </p>}
    </div>)
}



export function Message({ text }: { text: string }) {
    return <p className="container">{text}</p>
}