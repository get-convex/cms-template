import { PageTitle } from "../PageTitle";
import { StyledMarkdown } from "../Markdown";
import { Link } from "react-router-dom";
import { UserImage } from "../Author/Profile";
import type { Id, Doc } from "../../../convex/_generated/dataModel";
import { FileTextIcon } from "@radix-ui/react-icons";

export type PostWithAuthor = Doc<"posts"> & {
  author?: Doc<"users">;
};

// Either a `posts` or `versions` document, or unsaved version
export type PostOrVersion = Doc<"posts"> &
  Doc<"versions"> & {
    _id?: Id<"posts"> | Id<"versions">;
    editorId?: Id<"users"> | null;
    postId?: Id<"posts">;
    author?: Doc<"users"> | null;
  };

export function Byline({
  author,
  timestamp,
}: {
  author: Doc<"users"> | null;
  timestamp?: number;
}) {
  // If no timestamp given, this is a draft/preview; show today's date
  const date = new Date(timestamp || Date.now()).toDateString();

  return (
    author && (
      <div className="flex items-center gap-2">
        <UserImage src={author.image} />
        <div className="flex flex-col">
          <Link
            to={`/authors/${author.slug}`}
            className="text-sm underline-offset-2 hover:underline"
          >
            {author.name}
          </Link>
          <div className="font-mono text-sm text-neutral-n6">{date}</div>
        </div>
      </div>
    )
  );
}

export function PostImage({
  imageUrl,
  title,
}: Partial<Pick<PostOrVersion, "imageUrl" | "title">>) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        className="w-full rounded-lg"
        alt={`Cover image for blog post ${title || ""}`}
      />
    );
  } else {
    return (
      <div className="bg-gradient-to-br from-convex-yellow to-convex-purple col-span-1 rounded-lg flex items-center justify-center">
        <FileTextIcon className="w-20 h-20" />
      </div>
    );
  }
}

export function PostPreview({ post }: { post: PostWithAuthor }) {
  return (
    post && (
      <div
        className={`p-5 md:pr-4  lg:pr-4 grid grid-cols-1 md:grid-cols-3 gap-6 ${
          post.published ? "" : "italic bg-muted text-muted-foreground"
        }`}
      >
        <PostImage imageUrl={post.imageUrl} title={post.title} />
        <div className={`flex flex-col gap-6 ${"md:col-span-2"} `}>
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-col gap-3">
              <div className="line-clamp-2 text-2xl leading-tight decoration-neutral-n6 underline-offset-4 hover:underline">
                <Link to={`/${post.slug}`}>{post.title}</Link>
              </div>
              {post.summary && (
                <div className="line-clamp-2 max-w-xl shrink-0 text-sm">
                  <StyledMarkdown content={post.summary} />
                </div>
              )}
            </div>
          </div>
          {post.author && (
            <Byline author={post.author} timestamp={post.publishTime} />
          )}
        </div>
      </div>
    )
  );
}

export function PreviewGallery({ posts }: { posts: Doc<"posts">[] }) {
  if (!posts?.length) {
    return (
      <h1 className="text-xl font-semibold sm:text-2xl lg:text-4xl py-2">
        No posts found
      </h1>
    );
  } else {
    return (
      <div>
        {posts?.map((post) => <PostPreview key={post._id} post={post} />)}
      </div>
    );
  }
}

export function DisplayPost({ post }: { post: PostOrVersion }) {
  return (
    post && (
      <article className="container">
        <div className="mb-4 grid grid-cols-1 items-start gap-2">
          <div className="flex flex-col h-full gap-8 px-0 sm:px-20 lg:px-32">
            <PageTitle title={post.title} />
            {post.author && (
              <Byline author={post.author} timestamp={post.publishTime} />
            )}

            {post.summary && (
              <div className="text-muted-foreground italic">
                <StyledMarkdown content={post.summary} />
              </div>
            )}
          </div>
          <div className="my-4">
            {post.imageUrl && (
              <PostImage imageUrl={post.imageUrl} title={post.title} />
            )}
          </div>

          <div className="px-0 sm:px-20 lg:px-32">
            <StyledMarkdown content={post.content} />
          </div>
        </div>
      </article>
    )
  );
}
