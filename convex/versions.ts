import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import schema, { versions } from "./schema";
import type { Doc } from "./_generated/dataModel";
import { crud } from "convex-helpers/server/crud";
import { create as createPost, isSlugTaken } from "./posts";

export const {
    create,
    read,
    update,
    destroy
} = crud(schema, 'versions');

export const saveDraft = mutation({
    args: {
        ...versions.withoutSystemFields,
        postId: v.optional(v.union(v.literal(""), v.id('posts')))
    },
    handler: async (ctx, args) => {
        const { postId, editorId, ...data } = args;
        const slugTaken = await isSlugTaken(ctx,
            { slug: data.slug, postId: postId || undefined });
        if (slugTaken) throw new Error(slugTaken);

        let id = postId;
        if (!id) {
            const newPost = await createPost(ctx, data);
            id = newPost._id
        }
        return await create(ctx, { ...data, editorId, postId: id });

    }
})

const joinUsers = async (ctx: QueryCtx, version: Doc<'versions'>) => {
    const author = (await ctx.db.get(version.authorId))!;
    const editor = (await ctx.db.get(version.editorId))!;
    return { ...version, author, editor };
}

export const getById = query({
    args: {
        versionId: v.id('versions'),
        withUsers: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const version = await read(ctx, { id: args.versionId });
        if (!version) return null;
        return args.withUsers
            ? await joinUsers(ctx, version)
            : version
    }
})

export const getPostHistory = query({
    args: {
        postId: v.id('posts'),
    },
    handler: async (ctx, args) => {
        const versions = await ctx.db.query("versions")
            .withIndex('by_postId', q => q.eq('postId', args.postId))
            .order("desc")
            .collect();

        const withUsers = await Promise.all(
            versions.map(v => joinUsers(ctx, v)));
        return withUsers;
    }
});
