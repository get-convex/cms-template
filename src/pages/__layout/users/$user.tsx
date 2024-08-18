import { Message } from "@/components/PageTitle";
import { useQuery } from "convex/react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { UserProfile } from "@/components/User/Profile";
import { EditorToolbar } from "@/components/Blog/Edit";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

export default () => {

    const { user: userId } = useParams();

    const viewer = useQuery(api.users.viewer);
    const user = useQuery(api.users.read, {
        id: userId! as Id<'users'>
    });
    const posts = useQuery(api.users.authoredPosts, {
        userId: userId! as Id<'users'>
    })
    const viewerIsUser = viewer?._id === user?._id;

    if (user === undefined) return <Message text="Loading..." />
    if (user == null) return <Message text="Not found" />
    return <div>
        {user
            ? <>
                {viewerIsUser && (<EditorToolbar>
                    <div className="w-full flex justify-end">
                        <Link to={`/users/${user._id}/edit`} className={`flex gap-2 items-center`} >
                            <Button>
                                Edit
                                <Pencil1Icon className="h-6 w-6 pl-2" />
                            </Button>
                        </Link>
                    </div>
                </EditorToolbar>)}
                <UserProfile user={user} posts={posts} /></>
            : <Message text={user === null ? 'Not found' : 'Loading...'} />}
    </div>
};

