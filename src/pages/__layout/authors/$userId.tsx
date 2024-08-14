import { Message } from "@/components/PageTitle";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { DisplayAuthor } from "@/components/Author";

export default () => {

    const { userId } = useParams();

    const author = useQuery(api.authors.byUserId, {
        userId: userId! as Id<'users'>
    });

    if (author === undefined) return <Message text="Loading..." />
    if (author == null) return <Message text="Not found" />
    return <>
        {author
            ? <DisplayAuthor author={author} />
            : <Message text={author === null ? 'Not found' : 'Loading...'} />}
    </>
};

