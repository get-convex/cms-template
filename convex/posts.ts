import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { posts } from "./schema";
import { crud } from "convex-helpers/server";
import { viewer as getViewer } from "./users";
import type { Doc } from "./_generated/dataModel";

export const {
    create,
    read,
    update,
    destroy
} = crud(posts, query, mutation);

export const getOrCreate = mutation({
    args: {
        postId: v.optional(v.id('posts')),
        content: v.object(posts.withoutSystemFields)
    },
    handler: async (ctx, args) => {
        if (!args.postId) {
            return await create(ctx, args.content);
        }
    }
})


export const publish = mutation({
    args: {
        versionId: v.id('versions')
    },
    handler: async (ctx, args) => {
        const version = await ctx.db.get(args.versionId)
        if (!version) {
            throw new Error(`Version ${args.versionId} not found`);
        }
        const { _id, _creationTime, editorId: _editorId,
            postId, ...content } = version;
        const oldPost = await ctx.db.get(postId);
        if (!oldPost) {
            throw new Error(`Post ${version.postId} not found`);
        }
        const patch = {
            ...content,
            published: true,
            publishTime: oldPost.publishTime || Date.now(),
            updateTime: Date.now(),
        }
        await update(ctx, { id: postId, patch })
        return read(ctx, { id: postId });
    }
})


export const list = query({
    args: {},
    handler: async (ctx) => {
        // If the user is authenticated, include unpublished drafts
        // by omitting the index filter. Otherwise, use the index
        // filter to only return published posts
        const viewer = await getViewer(ctx, {});

        const posts = await ctx.db.query("posts")
            .withIndex('by_published',
                viewer ? undefined : q => q.eq('published', true)
            )
            .order("desc")
            .collect();


        return Promise.all(
            posts.map(async (post) => {
                // Add the author's details to each post.
                const author = (await ctx.db.get(post.authorId))!;
                return { ...post, author };
            }),
        );
    },
});

export const getById = query({
    args: {
        id: v.id('posts'),
        withAuthor: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const { id, withAuthor } = args
        const post = await ctx.db.get(id);
        if (!post) return null;
        let author;
        if (withAuthor) {
            // Add the author's details to each post.
            author = (await ctx.db.get(post.authorId))!;
        }
        return { ...post, author };

    }
})

type PostAugmented = Doc<'posts'> & {
    draft?: Doc<'versions'>;
    author?: Doc<'users'>;
};
export const getBySlug = query({
    args: {
        slug: v.string(),
        withDraft: v.optional(v.boolean()),
        withAuthor: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        let post = await ctx.db.query('posts')
            .withIndex('by_slug', q => q.eq('slug', args.slug))
            .unique();

        if (!post) {
            // The slug for this post may have changed
            // try searching for this slug in old versions
            const version = await ctx.db.query('versions')
                .withIndex('by_slug', q => q.eq('slug', args.slug))
                .first();

            if (version) {
                // The slug is outdated, lookup the postId
                post = await ctx.db.get(version.postId);
            }
        }
        if (!post) return null; // The slug is unknown

        const viewer = await getViewer(ctx, {});
        if (!viewer && !post.published) {
            // This is an unpublished draft, unauthenticated
            // user does not have permission to view it
            return null;
        }

        const result: PostAugmented = { ...post };

        if (args.withDraft) {
            // Find the most recent unpublished draft, if any,
            // created after this post was last updated
            const draft = await ctx.db.query('versions')
                .withIndex('by_postId', q => q.eq('postId', post._id))
                .filter(q => q.and(
                    q.gt(q.field('_creationTime'),
                        post.updateTime || post._creationTime),
                    q.eq(q.field('published'), false)
                ))
                .first()
            if (draft) {
                result.draft = draft;
            }
        }

        if (args.withAuthor) {
            const author = await ctx.db.get(post.authorId);
            if (author) {
                result.author = author
            }
        }

        return result;
    }
});

