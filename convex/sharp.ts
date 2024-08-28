"use node";

import sharp from "sharp";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { api } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

export const convert = internalAction({
    args: { imageId: v.id("images"), resizeTo: v.optional(v.number()) },
    handler: async (ctx, args): Promise<Doc<'images'>> => {
        const { imageId, resizeTo } = args;

        const image = await ctx.runQuery(api.images.read, { id: imageId })
        if (!image) throw new Error(`Image ID not found: ${imageId}`)

        const stored = await ctx.storage.get(image.storageId);
        if (stored === null)
            throw new Error(`Storage ID not found: ${image.storageId}`);

        const buffer = await stored.arrayBuffer();

        let sharped = sharp(buffer)
        if (resizeTo) {
            sharped = sharped.resize(resizeTo)
        }
        const webp = await sharped.webp().toBuffer();
        const type = "image/webp";
        const convertedId = await ctx.storage.store(new Blob([webp], { type }));
        return await ctx.runMutation(api.images.save, {
            storageId: convertedId,
            type,
            name: image.name,
            size: resizeTo || image.size
        });

    }
});
