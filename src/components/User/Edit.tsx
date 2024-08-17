import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { CompactProfile } from "./Profile";
import { PageTitle } from "../PageTitle";



export function EditableProfile({ user }: { user: Doc<'users'> }) {
    const viewer = useQuery(api.users.viewer);
    if (viewer?._id !== user._id) {
        return <p className="container">You do not have permission to edit this user's profile.</p>
    } else {
        return <>
            <PageTitle title={`Editing ${user.name}'s Profile`} />
            <CompactProfile user={user} />
        </>
    }

}