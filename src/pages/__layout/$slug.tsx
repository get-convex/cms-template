import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { DisplayPost } from "@/components/Blog/Post";
import { EditorToolbar } from "@/components/Blog/Edit";


export function Message({ text }: { text: string }) {
    return <p className="container">{text}</p>
}

export default () => {

    const { slug } = useParams();

    const post = useQuery(api.posts.getBySlug, {
        slug: slug!,
        joinAuthor: true
    });

    if (post === undefined) return <Message text="Loading..." />
    if (post == null) return <Message text="Not found" />
    return <>
        <EditorToolbar post={post} />
        {post
            ? <DisplayPost post={post} />
            : <Message text={post === null ? 'Not found' : 'Loading...'} />}
    </>
};

