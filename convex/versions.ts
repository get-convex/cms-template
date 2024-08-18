import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { posts, versions } from "./schema";
import type { Doc } from "./_generated/dataModel";
import { publish as publishPost } from "./posts";
import { crud } from "convex-helpers/server";

export const {
    create,
    read,
    update,
    destroy
} = crud(versions, query, mutation);


export const getPostHistory = query({
    args: {
        postId: v.id('posts'),
        withUsers: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const versions = await ctx.db.query("versions")
            .withIndex('by_postId', q => q.eq('postId', args.postId))
            .order("desc")
            .collect();

        if (args.withUsers) {
            return Promise.all(
                versions.map(async (version) => {
                    const author = (await ctx.db.get(version.authorId))!;
                    const editor = (await ctx.db.get(version.editorId))
                    return { ...version, author, editor };
                }),
            );
        } else {
            return versions;
        }

    },
});


// // Instead of mutating the post document directly,
// // we support version control and drafts by inserting
// // new documents with the same slug, which are then
// // indexed by published status and creation time to
// // allow easy retrieval of the latest published version
// // as well as iterating on unpublished drafts
// export const update = mutation({
//     args: posts.withoutSystemFields,
//     handler: async (ctx, args) => {
//         const { postId } = args;
//         const [previous] = await lookupByIndex(ctx, postId, {
//             index: 'postId',
//             published: 'all',
//             n: 1
//         });
//         let id;
//         if (previous) {
//             const { _id, _creationTime, ...oldData } = previous;
//             id = await ctx.db.insert('posts', { ...oldData, ...args });
//         } else {
//             id = await ctx.db.insert('posts', args);
//         }
//         return ctx.db.get(id);
//     }
// })


// async function lookupByIndex(ctx: QueryCtx, lookupValue: string, options: {
//     index: 'slug',
//     published?: true | false | 'all',
//     n?: number
// } = { index: 'slug', published: true }) {
//     const indexName = `by_${options.index}` as const;
//     const indexPublished = `${indexName}_published` as const;
//     const db = ctx.db.query("posts");
//     let query;
//     if (options.published === 'all') {
//         query = db.withIndex(indexName, (q) =>
//             q.eq(options.index, lookupValue));
//     } else {
//         query = db.withIndex(indexPublished,
//             (q) => q.eq(options.index, lookupValue)
//                 .eq('published', true));
//     }
//     const ordered = query.order('desc')
//     const posts = await (options.n
//         ? ordered.take(options.n)
//         : ordered.collect());
//     return posts;
// }

// // Retrieve the latest post by its slug
// export const getBySlug = query({
//     args: {
//         slug: v.string(),
//         includeDrafts: v.optional(v.boolean()),
//         joinAuthor: v.optional(v.boolean())
//     },
//     handler: async (ctx, args) => {
//         const published = args.includeDrafts ? 'all' : true
//         const [post] = await lookupByIndex(ctx, args.slug, {
//             index: 'slug',
//             published,
//             n: 1
//         });
//         if (!post) return null;
//         if (args.joinAuthor) {
//             const author = await ctx.db.get(post.authorId);
//             return { ...post, author };
//         } else {
//             return post;
//         }

//     }
// });

// // Version History 
// export const getPostHistory = query({
//     args: {
//         postId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const all = await ctx.db.(ctx, args.postId, {
//             index: 'postId',
//             published: 'all'
//         });
//         const published = all.filter(p => p.published);
//         const drafts = all.filter(p => !p.published);
//         const history = args.includeHistory ? { history: all } : {};
//         return ({
//             ...history,
//             counts: {
//                 all: all.length,
//                 published: published.length,
//                 draft: drafts.length,
//             },
//             latest: {
//                 published: published[0],
//                 draft: drafts[0]
//             },
//         })
//     }

// })
