import { Authenticated, useQuery } from "convex/react";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "../../../../convex/_generated/api";
import { EditablePost } from "@/components/Blog/Edit";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { Post } from "@/components/Blog/Post";


export function Message({ text }: { text: string }) {
    return <p className="container">{text}</p>
}

export default () => {

    const [searchParams, _] = useSearchParams()

    // If we navigated here from a link on the site,
    // the searchParams should include a versionId
    const versionId = searchParams.get('v');
    const postById = useQuery(api.posts.getById, versionId
        ? { id: versionId as Id<'posts'>, joinAuthor: true }
        : 'skip') as Post | undefined | null;

    // If we navigated here manually or the versionId
    // is otherwise missing, fall back to lookup by slug
    const { slug } = useParams();
    const postBySlug = useQuery(api.posts.getBySlug, versionId
        ? 'skip'
        : {
            slug: slug!,
            includeDrafts: true,
            joinAuthor: true
        }) as Post | undefined | null;

    const post = postById || postBySlug;

    if (post === undefined) return <Message text="Loading..." />
    if (post == null) return <Message text="Not found" />
    return (<Authenticated>
        <EditablePost post={post} />
    </Authenticated>)
};

