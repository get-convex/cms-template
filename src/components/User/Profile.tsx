import { AvatarIcon, EnvelopeClosedIcon, GlobeIcon } from "@radix-ui/react-icons";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Link } from "react-router-dom";
import { StyledContent, StyledMarkdown } from "../Markdown";



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

export function UserProfile({ user }: { user: Doc<'users'> }) {
    return (<div className="container">
        <div className="flex flex-row items-center gap-4 mb-4">
            <UserImage src={user.image} />
            <div className="flex flex-col items-start gap-1">
                <h1 className="text-2xl">{user.name || `User ${user._id}`}</h1>
                {user.tagline && <p className="text-muted-foreground">{user.tagline}</p>}
            </div>
        </div>
        {user.bio && <StyledMarkdown content={user.bio} />}
        <div className="flex flex-col gap-2 mt-4">
            <StyledContent>
                {user.url &&
                    <a className="flex flex-row items-center gap-2" href={user.url} target="_blank">
                        <GlobeIcon className="text-primary h-6" />
                        {user.url}
                    </a>}
                {user.email &&
                    <a className="flex flex-row items-center gap-2" href={`mailto:${user.email}`}>
                        <EnvelopeClosedIcon className="text-primary h-6" />{user.email}
                    </a>}
            </StyledContent>
        </div>
    </div>)

}

export function UsersList({ users }: { users: Doc<'users'>[] }) {
    return (<div className="container">
        {users.map(u => <CompactProfile key={u._id} user={u} />)}
    </div>);
}