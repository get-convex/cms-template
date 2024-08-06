import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { crud } from "convex-helpers/server";
import { posts } from "./schema";
import type { Doc } from "./_generated/dataModel";

export const list = query({
    args: {},
    handler: async (ctx) => {
        // Grab the most recent posts.
        const posts = await ctx.db.query("posts")
            .withIndex('by_published', q => q.eq('published', true))
            .order("desc")
            .collect();

        const latestByPostId = {} as Record<string, Doc<'posts'>>;
        for (const post of posts) {
            if (post.postId in latestByPostId) {
                continue
            } else {
                latestByPostId[post.postId] = post
            }
        }
        const latest = Object.values(latestByPostId)
            .sort((a, b) => b._creationTime - a._creationTime)

        return Promise.all(
            latest.map(async (post) => {
                // Add the author's details to each post.
                const author = (await ctx.db.get(post.authorId))!;
                return { ...post, author };
            }),
        );
    },
});


export const {
    // Not using the default helper create/update, for versioning
    read,
    destroy
} = crud(posts, query, mutation);

export const getById = query({
    args: {
        id: v.id('posts'),
        joinAuthor: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const { id, joinAuthor } = args
        const post = await read(ctx, { id });
        if (!post) return null;
        let author;
        if (joinAuthor) {
            // Add the author's details to each post.
            author = (await ctx.db.get(post.authorId))!;
        }
        return { ...post, author };

    }
})

// Instead of mutating the post document directly,
// we support version control and drafts by inserting
// new documents with the same slug, which are then
// indexed by published status and creation time to
// allow easy retrieval of the latest published version
// as well as iterating on unpublished drafts
export const update = mutation({
    args: posts.withoutSystemFields,
    handler: async (ctx, args) => {
        const { postId } = args;
        const [previous] = await lookupByIndex(ctx, postId, {
            index: 'postId',
            published: 'all',
            n: 1
        });
        let id;
        if (previous) {
            const { _id, _creationTime, ...oldData } = previous;
            id = await ctx.db.insert('posts', { ...oldData, ...args });
        } else {
            id = await ctx.db.insert('posts', args);
        }
        return ctx.db.get(id);
    }
})


async function lookupByIndex(ctx: QueryCtx, lookupValue: string, options: {
    index: 'slug' | 'postId',
    published?: true | false | 'all',
    n?: number
} = { index: 'slug', published: true }) {
    const indexName = `by_${options.index}` as const;
    const indexPublished = `${indexName}_published` as const;
    const db = ctx.db.query("posts");
    let query;
    if (options.published === 'all') {
        query = db.withIndex(indexName, (q) =>
            q.eq(options.index, lookupValue));
    } else {
        query = db.withIndex(indexPublished,
            (q) => q.eq(options.index, lookupValue)
                .eq('published', true));
    }
    const ordered = query.order('desc')
    const posts = await (options.n
        ? ordered.take(options.n)
        : ordered.collect());
    return posts;
}

// Retrieve the latest post by its slug
export const getBySlug = query({
    args: {
        slug: v.string(),
        includeDrafts: v.optional(v.boolean()),
        joinAuthor: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const published = args.includeDrafts ? 'all' : true
        const [post] = await lookupByIndex(ctx, args.slug, {
            index: 'slug',
            published,
            n: 1
        });
        if (!post) return null;
        if (args.joinAuthor) {
            const author = await ctx.db.get(post.authorId);
            return { ...post, author };
        } else {
            return post;
        }

    }
});

// Version History 
export const getVersionStats = query({
    args: {
        postId: v.string(),
        includeHistory: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const all = await lookupByIndex(ctx, args.postId, {
            index: 'postId',
            published: 'all'
        });
        const published = all.filter(p => p.published);
        const drafts = all.filter(p => !p.published);
        const history = args.includeHistory ? { history: all } : {};
        return ({
            ...history,
            counts: {
                all: all.length,
                published: published.length,
                draft: drafts.length,
            },
            latest: {
                published: published[0],
                draft: drafts[0]
            },
        })
    }

})
