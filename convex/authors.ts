import { crud } from "convex-helpers/server";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { authors } from "./schema";
import { v } from "convex/values";

export const {
    create,
    read,
    update,
    destroy
} = crud(authors, query, mutation);


export const list = query({
    args: {},
    handler: async (ctx) => {
        const authors = await ctx.db.query('authors').collect();
        return Promise.all(authors.map(async (a) => {
            const user = await ctx.db.get(a.userId);
            return { ...a, user };
        }))
    }
});

export const byUserId = query({
    args: {
        userId: v.id("users")
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error(`No user found with id ${args.userId}`);
        }
        const author = await ctx.db.query("authors")
            .withIndex("by_userId", q => q.eq("userId", args.userId))
            .unique();
        return { ...author, user };
    }
})

export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const viewerId = await auth.getUserId(ctx);
        if (!viewerId) return null;
        return await ctx.db.query('authors')
            .withIndex('by_userId', q => q.eq('userId', viewerId))
            .unique();
    }
});



export const createFirstAuthor = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx)
        if (!userId) {
            throw new Error('Attempting to create first author while unauthenticated');
        }

        const authorCount = (await list(ctx, {})).length;

        // If there are no authors in the db yet,
        // "promote" the current user to Admin author
        if (authorCount === 0) {
            const author = await create(ctx, {
                userId,
                isAdmin: true,
            });
            const user = ctx.db.get(userId);
            return { ...author, user };
        }
    }
})
