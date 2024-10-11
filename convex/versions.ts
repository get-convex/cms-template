import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { isSlugTaken } from "./posts";
import schema from "./schema";

export const saveDraft = mutation({
  args: {
    ...schema.tables.versions.validator.fields,
    postId: v.optional(v.union(v.literal(""), v.id("posts"))),
  },
  handler: async (ctx, args) => {
    const { postId, editorId, ...data } = args;
    const slugTaken = await isSlugTaken(ctx, {
      slug: data.slug,
      postId: postId || undefined,
    });
    if (slugTaken) throw new Error(slugTaken);

    let id = postId;
    if (!id) {
      id = await ctx.db.insert("posts", data);
    }
    return (await ctx.db.get(
      await ctx.db.insert("versions", { ...data, editorId, postId: id }),
    ))!;
  },
});

const joinUsers = async (ctx: QueryCtx, version: Doc<"versions">) => {
  const author = (await ctx.db.get(version.authorId))!;
  const editor = (await ctx.db.get(version.editorId))!;
  return { ...version, author, editor };
};

export const getById = query({
  args: {
    versionId: v.id("versions"),
    withUsers: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const version = await ctx.db.get(args.versionId);
    if (!version) return null;
    return args.withUsers ? await joinUsers(ctx, version) : version;
  },
});

export const getPostHistory = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const versions = await ctx.db
      .query("versions")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    const withUsers = await Promise.all(versions.map((v) => joinUsers(ctx, v)));
    return withUsers;
  },
});
