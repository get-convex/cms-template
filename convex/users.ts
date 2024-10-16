import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";
import schema from "./schema";
import { partial } from "convex-helpers/validators";

export const update = mutation({
  args: {
    id: v.id("users"),
    patch: v.object(partial(schema.tables.users.validator.fields)),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("User not authenticated");
    await ctx.db.patch(args.id, args.patch);
  },
});

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    return userId ? await ctx.db.get(userId) : null;
  },
});

export const authoredPosts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.userId))
      .collect();
  },
});

export const listAuthors = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const withPosts = await Promise.all(
      users.map(async (u) => {
        const posts = await authoredPosts(ctx, { userId: u._id });
        return posts.length ? { ...u, posts } : null;
      }),
    );
    return withPosts.filter((u) => !!u);
  },
});

export const byEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();
  },
});

export const getOrSetSlug = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (user === null) return null;
    if (user.slug) return user.slug;

    let slug;
    if (user.name) {
      slug = encodeURIComponent(user.name.toLowerCase().replaceAll(" ", "-"));
    } else if (user.email) {
      slug = encodeURIComponent(user.email);
    } else {
      slug = user._id;
    }
    await ctx.db.patch(user._id, { slug });
    return slug;
  },
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .unique();
  },
});
