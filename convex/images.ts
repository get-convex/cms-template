
import { query, mutation } from "./_generated/server";
import { viewer as getViewer } from "./users";
import { images } from "./schema";
import { omit } from "convex-helpers";
import { crud } from "convex-helpers/server";
import { internal } from "./_generated/api";

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

export const saveOptimized = mutation({
    args: omit(images.withoutSystemFields, ['url']),
    handler: async (ctx, args) => {
        // Verify the user is still authenticated
        const viewer = await getViewer(ctx, {});
        if (!viewer)
            throw new Error('User not authenticated; cannot save file')


        // Save the original file metadata & storageId to 'images' table
        const url = await ctx.storage.getUrl(args.storageId);
        if (!url)
            throw new Error(`No url found for storageId ${args.storageId}`)
        const image = await create(ctx, { ...args, url });

        // Trigger the optimizeAndSave action
        await ctx.scheduler.runAfter(0, internal.sharp.convertAndUpdate, {
            imageId: image._id,
        });
        return image;
    }
})

export const save = mutation({
    args: omit(images.withoutSystemFields, ['url']),
    handler: async (ctx, args) => {
        // Verify the user is still authenticated
        const viewer = await getViewer(ctx, {});
        if (!viewer)
            throw new Error('User not authenticated; cannot save file')

        // Get the URL
        const url = await ctx.storage.getUrl(args.storageId);
        if (!url)
            throw new Error(`No url found for storageId ${args.storageId}`)

        // Save the file metadata, url & storageId to 'images' table
        const doc = await create(ctx, { ...args, url });
        return doc;
    }
});


