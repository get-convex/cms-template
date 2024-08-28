"use node";

import sharp from "sharp";
import { v } from "convex/values";
import { internalAction, type ActionCtx } from "./_generated/server";

async function sharpenAndStore(ctx: ActionCtx, buffer: ArrayBuffer, size?: number) {
    let sharped = sharp(buffer)
    if (size) {
        sharped = sharped.resize(size)
    }
    const data = await sharped.webp().toBuffer();
    const storageId = await ctx.storage.store(new Blob([data], { type: "image/webp" }));
    return storageId;
}

export const resize = internalAction({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        const data = await ctx.storage.get(args.storageId);
        if (data === null) {
            throw new Error("Image not found");
        }
        const buffer = await data.arrayBuffer();

        const webp = await sharpenAndStore(ctx, buffer);

        const small = await sharpenAndStore(ctx, buffer, 150);
        const medium = await sharpenAndStore(ctx, buffer, 300);

        const storageIds = {
            original: args.storageId,
            webp,
            small,
            medium
        };
        return storageIds;
    },
});
