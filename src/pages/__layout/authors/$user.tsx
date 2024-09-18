import { Message } from "@/components/PageTitle";
import { useQuery } from "convex/react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../../convex/_generated/api";
import { AuthorProfile } from "@/components/Author/Profile";
import { Toolbar } from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

export default function UserPage() {

    const { user: userSlug } = useParams();

    const viewer = useQuery(api.users.viewer);
    const user = useQuery(api.users.bySlug, userSlug ? {
        slug: userSlug
    } : 'skip');
    const posts = useQuery(api.users.authoredPosts, user ? {
        userId: user._id
    } : 'skip');
    const viewerIsUser = viewer?._id === user?._id;

    if (user === undefined) return <Message text="Loading..." />
    if (user == null) return <Message text="Not found" />
    return <div>
        {user
            ? <>
                {viewerIsUser && (<Toolbar>
                    <div className="w-full flex justify-end">
                        <Link to={`/authors/${user.slug}/edit`} className={`flex gap-2 items-center`} >
                            <Button>
                                Edit
                                <Pencil1Icon className="h-6 w-6 pl-2" />
                            </Button>
                        </Link>
                    </div>
                </Toolbar>)}
                <AuthorProfile user={user} posts={posts} /></>
            : <Message text={user === null ? 'Not found' : 'Loading...'} />}
    </div>
}

