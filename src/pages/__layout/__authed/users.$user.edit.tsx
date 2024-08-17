import { Message } from "@/components/PageTitle";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { CompactProfile } from "@/components/User/Profile";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export default () => {

    const { user: userId } = useParams();

    const user = useQuery(api.users.read, {
        id: userId! as Id<'users'>
    });
    const viewer = useQuery(api.users.viewer);

    if (user === undefined || viewer === undefined) return <Message text="Loading..." />
    if (user == null) return <Message text="Not found" />
    if (viewer === null || (viewer._id !== user._id)) {
        return <Message text="You do not have permission to edit this user's profile." />
    }

    return (<div className="container"><CompactProfile user={user} /></div>)
};

