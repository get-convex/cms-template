import { AvatarIcon } from "@radix-ui/react-icons";
import type { Doc } from "../../convex/_generated/dataModel";
import { PageTitle } from "./PageTitle";


export type Author = Doc<'authors'> & {
    user: Doc<'users'>
}

export function AuthorImage({ src }: { src?: string }) {
    if (src) {
        return <img alt="Profile image" src={src}
            className="relative h-10 w-10 rounded-full" />
    } else {
        return <AvatarIcon className="relative h-10 w-10" />
    }
}

export function DisplayAuthor({ author }: { author: any }) {
    return (<div className="container">
        <PageTitle title={author.user.name || 'Author'} />
        <AuthorImage src={author.user?.image} />
    </div>)
}