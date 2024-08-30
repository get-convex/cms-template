import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";
import { users } from "./schema";
import { crud } from "convex-helpers/server";

export const {
  create,
  read,
  update,
  destroy
} = crud(users, query, mutation);


export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    return userId ? await ctx.db.get(userId) : null;
  }
});



export const authoredPosts = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.query('posts')
      .withIndex('by_authorId', q => q.eq('authorId', args.userId))
      .collect()
  }
})

export const listAuthors = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    const withPosts = await Promise.all(users.map(async u => {
      const posts = await authoredPosts(ctx, { userId: u._id });
      return posts.length ? { ...u, posts } : null
    }))
    return withPosts.filter(u => !!u);
  }
});

export const byEmail = query({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.query('users')
      .filter(q => q.eq(q.field('email'), args.email))
      .unique();
  }
})