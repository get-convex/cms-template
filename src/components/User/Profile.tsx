import { AvatarIcon } from "@radix-ui/react-icons";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Link } from "react-router-dom";


export function UserImage({ src }: { src?: string }) {
    if (src) {
        return <img alt="Profile image" src={src}
            className="relative h-10 w-10 rounded-full" />
    } else {
        return <AvatarIcon className="relative h-10 w-10" />
    }
}

export function CompactProfile({ user }: { user: Doc<'users'> }) {
    return (<Link to={`/users/${user._id}`}
        className="flex flex-row items-center gap-4">
        <UserImage src={user.image} />
        <h2 className="text-xl">{user.name || `User ${user._id}`}</h2>
    </Link>)
}

export function UsersList({ users }: { users: Doc<'users'>[] }) {
    return (<div className="container">
        {users.map(u => <CompactProfile key={u._id} user={u} />)}
    </div>);
}