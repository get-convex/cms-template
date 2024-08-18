import { Message } from "@/components/PageTitle";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { api } from "../../../../convex/_generated/api";
import { EditableProfile } from "@/components/User/Edit";
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
        // Should never get here, but just in case
        return <Message text="You do not have permission to edit this user's profile." />
    }

    return (<EditableProfile user={user} />)
};

