import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Message, PageTitle } from "@/components/PageTitle";
import { UsersList } from "@/components/User/Profile";


export default () => {
    const users = useQuery(api.users.list, { includePosts: true });

    return (<>
        <div className="container">
            <PageTitle title='Users' />
        </div>
        {users === undefined
            ? <Message text="Loading..." />
            : <UsersList users={users} />
        }
    </>)
}