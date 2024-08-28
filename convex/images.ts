
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { viewer as getViewer } from "./users";
import { images } from "./schema";
import { omit } from "convex-helpers";
import { crud } from "convex-helpers/server";

export const {
    create,
    read,
    update,
    destroy
} = crud(images, query, mutation);



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
    args: omit(images.withoutSystemFields, ['url']),
    handler: async (ctx, args) => {
        // Verify the user is still authenticated
        const viewer = await getViewer(ctx, {});
        if (!viewer)
            throw new Error('User not authenticated; cannot save file metadata')

        // Get the URL
        const url = await ctx.storage.getUrl(args.storageId);
        if (!url)
            throw new Error(`No url found for storageId ${args.storageId}`)

        // Save the file metadata, url & storageId to 'images' table
        const doc = await create(ctx, { ...args, url });
        return doc;
    }
})


