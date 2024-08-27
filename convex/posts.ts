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
    publicVersion?: Doc<'versions'>;
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
        const versionsBySlug = ctx.db.query('versions')
            .withIndex('by_slug', q => q.eq('slug', args.slug))

        const publicVersion = await versionsBySlug
            .filter(q => q.eq(q.field('published'), true))
            .order('desc')
            .first();

        let post = await ctx.db.query('posts')
            .withIndex('by_slug', q => q.eq('slug', args.slug))
            .order('desc')
            .first();

        if (!post) {
            // The slug for this post may have changed
            // try searching for this slug in old versions
            if (publicVersion) {
                // The slug is outdated, lookup the postId
                post = await ctx.db.get(publicVersion.postId);
            }
        }
        if (!post) return null; // The slug is unknown

        const viewer = await getViewer(ctx, {});
        if (!viewer && !post.published) {
            // This is an unpublished draft, unauthenticated
            // user does not have permission to view it
            return null;
        }

        const result: PostAugmented = post;
        if (publicVersion) {
            result.publicVersion = publicVersion;
        }

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
                .order('desc')
                .first();
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


export const isSlugTaken = query({
    args: {
        slug: v.string(),
        postId: v.optional(v.id('posts'))
    },
    handler: async (ctx, args) => {
        const { slug, postId } = args;

        // Find any existing post(s) with this slug and flag
        // any whose postId doesn't match the one given
        const posts = await ctx.db.query('posts')
            .withIndex('by_slug', q => q.eq('slug', slug))
            .collect();
        const badPostIds = new Set(
            posts.filter(p => p._id !== postId).map(p => p._id)
        );

        // It's possible that the slug is no longer in use on any posts,
        // but had previously been used in an old version of another post.
        // Collect all version(s) with this slug...
        const versions = await ctx.db.query('versions')
            .withIndex('by_slug', q => q.eq('slug', slug))
            .collect();
        // ...and flag any whose postId doesn't match the one given.
        const badVersions = versions.filter(v => v.postId !== postId);
        badVersions.map(v => badPostIds.add(v.postId))


        if (badPostIds.size > 0) {
            // This slug is unavailable (already/previously in use)
            const msg = `Slug "${slug}" is unavailable, used on post(s) ${Array.from(badPostIds).toString()}`;
            console.error(msg);
            return msg;
        } else {
            return false;
        }
    }
})