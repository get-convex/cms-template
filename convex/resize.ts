// "use node";

// import sharp from "sharp";
// import { v } from "convex/values";
// import { internalAction } from "./_generated/server";



// export const resize = internalAction({
//     args: { storageId: v.id("_storage") },
//     handler: async (ctx, args) => {
//         const data = await ctx.storage.get(args.storageId);
//         if (data === null) {
//             throw new Error("Image not found");
//         }
//         const buffer = await data.arrayBuffer();

//         const small = await sharp(buffer).resize(100).webp().toBuffer();
//         const smallId = await ctx.storage.store(new Blob([small], { type: "image/webp" }));

//         const storageIds = {
//             small: smallId,
//         };
//         return storageIds;
//     },
// });
