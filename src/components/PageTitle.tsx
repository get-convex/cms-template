export function PageTitle({ title, tagline }:
    { title: string, tagline?: string }) {
    return (<div className="flex flex-col gap-2 py-4">
        <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
        {tagline && <p className="sm:block text-sm text-muted-foreground py-2">
            {tagline}
        </p>}
    </div>)
}