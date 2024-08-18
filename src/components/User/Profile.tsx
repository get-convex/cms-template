import { AvatarIcon, EnvelopeClosedIcon, GlobeIcon } from "@radix-ui/react-icons";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Link } from "react-router-dom";
import { StyledContent, StyledMarkdown } from "../Markdown";
import { PreviewGallery } from "../Blog/Post";

const sizeClass = {
    's': `h-5 w-5`,
    'm': `h-10 w-10`,
    'l': `h-24 w-24`,
    'full': `h-full w-full`
}


export function UserImage({ src, size }: { src?: string; size?: keyof typeof sizeClass }) {

    return src
        ? <img alt="Profile image" src={src}
            className={'relative rounded-full ' + sizeClass[size || 'm']} />
        : <AvatarIcon className={'relative ' + sizeClass[size || 'm']} />

}

export function CompactProfile({ user }: { user: Doc<'users'> }) {
    return (<Link to={`/users/${user._id}`}
        className="flex flex-row items-center gap-4">
        <UserImage src={user.image} />
        <h2 className="text-xl">{user.name || `User ${user._id}`}</h2>
    </Link>)
}

export function UserProfile({ user, posts }: {
    user: Doc<'users'>,
    posts?: Doc<'posts'>[]
}) {
    return (<div className="container flex flex-col gap-8">
        <div className="flex flex-row items-center gap-4 mb-4 h-">
            <UserImage src={user.image} size="l" />
            <div className="flex flex-col items-start gap-2">
                <h1 className="text-2xl">{user.name || `User ${user._id}`}</h1>
                {user.tagline && <p className="text-muted-foreground">{user.tagline}</p>}
                <StyledContent>
                    <div className="flex flex-row gap-4 text-sm">

                        {user.url &&
                            <a className="flex flex-row items-center gap-2  no-underline" href={user.url} target="_blank">
                                <GlobeIcon className="text-primary h-4" />
                                {user.url.replace(/http(s?):\/\//, '')}
                            </a>}
                        {user.email &&
                            <a className="flex flex-row items-center gap-2  no-underline" href={`mailto:${user.email}`}>
                                <EnvelopeClosedIcon className="text-primary h-4" />
                                {user.email}
                            </a>}
                    </div>
                </StyledContent>

            </div>
        </div>
        {user.bio && <StyledMarkdown content={user.bio} />}
        {posts && <div >
            <h3 className="text-muted-foreground text-lg mb-4">Posts by this author</h3>
            <PreviewGallery posts={posts} />
        </div>

        }

    </div>)

}

export function UsersList({ users }: { users: Doc<'users'>[] }) {
    return (<div className="container">
        {users.map(u => <CompactProfile key={u._id} user={u} />)}
    </div>);
}