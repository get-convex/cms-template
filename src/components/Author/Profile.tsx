import {
  AvatarIcon,
  EnvelopeClosedIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Link } from "react-router-dom";
import { StyledContent, StyledMarkdown } from "../Markdown";
import { PreviewGallery } from "../Blog/Post";
import { PageTitle } from "../PageTitle";

const sizeClass = {
  s: `h-5 w-5`,
  m: `h-10 w-10`,
  l: `h-24 w-24`,
  full: `h-full w-full`,
};

export function UserImage({
  src,
  size,
}: {
  src?: string;
  size?: keyof typeof sizeClass;
}) {
  if (src) {
    return (
      <img
        alt="Profile image"
        src={src}
        className={"relative rounded-full " + sizeClass[size || "m"]}
      />
    );
  } else {
    return <AvatarIcon className={"relative " + sizeClass[size || "m"]} />;
  }
}

export function CompactProfile({ user }: { user: Doc<"users"> }) {
  return (
    <Link
      to={`/authors/${user.slug}`}
      className="flex flex-row items-center gap-4"
    >
      <UserImage src={user.image} />
      <div className="flex flex-col gap-2">
        <h2 className="text-xl">{user.name || `User ${user._id}`}</h2>
        {user.tagline && <StyledMarkdown content={user.tagline} />}
      </div>
    </Link>
  );
}

export function AuthorProfile({
  user,
  posts,
}: {
  user: Doc<"users">;
  posts?: Doc<"posts">[];
}) {
  return (
    <div className="container flex flex-col gap-8">
      <div className="flex flex-row items-center gap-4 mb-4 h-">
        <UserImage src={user.image} size="l" />
        <div className="flex flex-col items-start gap-2">
          <PageTitle title={user.name || `User ${user._id}`} />
          {user.tagline && <StyledMarkdown content={user.tagline} />}
          <StyledContent>
            <div className="flex flex-row gap-4 text-sm">
              {user.url && (
                <a
                  className="flex flex-row items-center gap-2  no-underline"
                  href={user.url}
                  target="_blank"
                >
                  <GlobeIcon className="text-primary h-4" />
                  {user.url.replace(/http(s?):\/\//, "")}
                </a>
              )}
              {user.email && (
                <a
                  className="flex flex-row items-center gap-2  no-underline"
                  href={`mailto:${user.email}`}
                >
                  <EnvelopeClosedIcon className="text-primary h-4" />
                  {user.email}
                </a>
              )}
            </div>
          </StyledContent>
        </div>
      </div>
      {user.bio && <StyledMarkdown content={user.bio} />}
      {posts && (
        <div>
          <h3 className="text-muted-foreground text-lg mb-4">
            Posts by this author
          </h3>
          <PreviewGallery posts={posts} />
        </div>
      )}
    </div>
  );
}

export function AuthorsList({ users }: { users: Doc<"users">[] }) {
  return (
    <div className="container flex flex-col gap-4">
      {users.map((u) => (
        <CompactProfile key={u._id} user={u} />
      ))}
    </div>
  );
}
