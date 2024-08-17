import { Message } from "@/components/PageTitle";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { CompactProfile } from "@/components/User/Profile";

export default () => {

    const { user: userId } = useParams();

    const user = useQuery(api.users.read, {
        id: userId! as Id<'users'>
    });

    if (user === undefined) return <Message text="Loading..." />
    if (user == null) return <Message text="Not found" />
    return <div className="container">
        {user
            ? <CompactProfile user={user} />
            : <Message text={user === null ? 'Not found' : 'Loading...'} />}
    </div>
};

