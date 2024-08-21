import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { versions } from "./schema";
import type { Doc } from "./_generated/dataModel";
import { crud } from "convex-helpers/server";

export const {
    create,
    read,
    update,
    destroy
} = crud(versions, query, mutation);

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