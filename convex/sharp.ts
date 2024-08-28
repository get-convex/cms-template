"use node";

import sharp from "sharp";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { api } from "./_generated/api";


export const convertAndUpdate = internalAction({
    args: {
        imageId: v.id("images"),
        width: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { imageId, width } = args;
        const image = await ctx.runQuery(api.images.read, { id: imageId });
        if (!image) throw new Error(`Image not found: ${imageId}`);

        const original = await ctx.storage.get(image.storageId);
        if (original === null)
            throw new Error(`Storage ID not found: ${image.storageId}`);

        const buffer = await original.arrayBuffer();

        let sharped = sharp(buffer)
        if (width) {
            sharped = sharped.resize(width)
        }
        const webp = await sharped.webp().toBuffer();
        const type = "image/webp";
        const blob = new Blob([webp], { type });

        const convertedId = await ctx.storage.store(blob);
        const convertedUrl = await ctx.storage.getUrl(convertedId);
        if (!convertedUrl)
            throw new Error(`No url found for storageId ${convertedId}`)


        const oldName = image.name || `Image_${imageId}`;
        const newName = oldName + `_w${width}.webp`

        await ctx.runMutation(api.images.update, {
            id: imageId,
            patch: {
                storageId: convertedId,
                type,
                name: newName,
                size: blob.size,
                url: convertedUrl
            }
        });

    }
});