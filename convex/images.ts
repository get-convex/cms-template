
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { viewer as getViewer } from "./users";

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        // Verify the user is authenticated
        const viewer = await getViewer(ctx, {});
        if (!viewer) throw new Error('User not authenticated; cannot generate upload URL')

        // Return an upload URL
        return await ctx.storage.generateUploadUrl();
    },
});

export const save = mutation({
    args: {
        storageId: v.id('_storage'),
        authorId: v.id('users'),
        name: v.string(),
        type: v.string(),
        size: v.number()
    },
    handler: async (ctx, args) => {
        // Verify the user is still authenticated
        const viewer = await getViewer(ctx, {});
        if (!viewer)
            throw new Error('User not authenticated; cannot save file metadata')

        const url = await ctx.storage.getUrl(args.storageId);
        if (!url)
            throw new Error(`Could not find storageId ${args.storageId}`)

        // Save the file metadata, url & storageId to 'files' table
        const docId = await ctx.db.insert('images', { ...args, url });
        return await ctx.db.get(docId);
    }
})


