import { PageTitle } from "../PageTitle";
import { StyledMarkdown } from "../Markdown";
import { Link } from "react-router-dom";
import { UserImage } from "../Author/Profile";
import type { Id, Doc } from "../../../convex/_generated/dataModel";

export type PostWithAuthor = Doc<'posts'> & {
    author?: Doc<'users'>
}

// Either a `posts` or `versions` document, or unsaved version
export type PostOrVersion = Doc<'posts'> & Doc<'versions'> & {
    _id?: Id<'posts'> | Id<'versions'>;
    editorId?: Id<'users'> | null;
    postId?: Id<'posts'>
    author?: Doc<'users'> | null;
}

export function Byline({ author, timestamp }: { author: Doc<'users'> | null, timestamp: number }) {

    const date = new Date(timestamp).toDateString();
    const authorSlug = author?._id;

    return (author &&
        <div className="flex items-center gap-2">
            <UserImage src={author.image} />
            <div className="flex flex-col">
                <Link to={`/authors/${authorSlug}`}
                    className="text-sm underline-offset-2 hover:underline">
                    {author.name}
                </Link>
                <div className="font-mono text-sm text-neutral-n6">
                    {date}
                </div>
            </div>
        </div>)
}

export function PostImage({ imageUrl, title }: Pick<PostOrVersion, 'imageUrl' | 'title'>) {
    return <img src={imageUrl} className="w-full rounded-lg" alt={`Cover image for blog post ${title}`} />
}

export function PostPreview({ post }: { post: PostWithAuthor }) {
    return post && (<div className="border border-neutral-n10 p-5 md:pr-4  lg:pr-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {post.imageUrl && <PostImage imageUrl={post.imageUrl} title={post.title} />}
        <div className={`flex flex-col gap-6 ${post.imageUrl ? 'col-span-1' : 'md:col-span-2'}`}>
            <div className="flex flex-row items-center gap-3">
                <div className="flex flex-col gap-3">
                    <div className="line-clamp-2 text-2xl leading-tight decoration-neutral-n6 underline-offset-4 hover:underline">
                        <Link to={`/${post.slug}`}>
                            {post.title}
                        </Link>
                    </div>
                    {post.summary && <div className="line-clamp-2 max-w-xl shrink-0 text-sm">
                        <StyledMarkdown content={post.summary} />
                    </div>}
                </div>
            </div>
            {post.author &&
                <Byline author={post.author} timestamp={post._creationTime} />}
        </div>

    </div >);

}


export function PreviewGallery({ posts }: { posts: Doc<'posts'>[] }) {
    if (!posts?.length) return <PageTitle title="No posts yet" />
    const [hero, ...morePosts] = posts;
    return (<div>
        <PostPreview post={hero} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {morePosts?.map((post) => <PostPreview key={post._id} post={post} />)}
        </div>
    </div>)
}

export function DisplayPost({ post }: {
    post: PostOrVersion
}) {
    return post && (<article className="container" >
        <div className="mb-4 grid grid-cols-2 items-start gap-2">
            <div className="flex flex-col h-full gap-8">
                <PageTitle title={post.title} />
                {post.author &&
                    <Byline author={post.author} timestamp={post._creationTime || Date.now()} />}

                <p className="text-muted-foreground italic">
                    {post.summary}
                </p>
            </div>
            <div>
                {post.imageUrl &&
                    <PostImage imageUrl={post.imageUrl} title={post.title} />}
            </div>
        </div>


        <StyledMarkdown content={post.content} />

    </article>)
};