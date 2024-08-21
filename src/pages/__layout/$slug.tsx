import { useQuery } from "convex/react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { DisplayPost, type PostOrVersion } from "@/components/Blog/Post";
import { Toolbar } from "@/components/Toolbar";
import { Message } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";


export default function PostPage() {

    const { slug } = useParams();

    const post = useQuery(api.posts.getBySlug, {
        slug: slug!,
        withAuthor: true,
        withDraft: true
    });
    const draftVersion = post?.draft && post.draft._id;


    if (post === undefined) return <Message text="Loading..." />
    if (post == null) return <Message text="Not found" />
    return <>
        <Toolbar >
            <div className="flex grow justify-end items-center">
                {post &&
                    <Link to={`/${post.slug}/edit${draftVersion
                        ? `?v=${draftVersion}`
                        : ''}`}
                        className={`flex gap-2 items-center`} >
                        <Button>
                            Edit post
                            <Pencil1Icon className="h-6 w-6 pl-2" />
                        </Button>
                    </Link>
                }
            </div>
        </Toolbar >
        {
            post
                ? <DisplayPost post={post as PostOrVersion} />
                : <Message text={post === null ? 'Not found' : 'Loading...'} />
        }
    </>
}

