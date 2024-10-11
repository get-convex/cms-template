import {
  query,
  mutation,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { viewer as getViewer } from "./users";
import schema from "./schema";
import { omit } from "convex-helpers";
import { crud } from "convex-helpers/server/crud";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const { read, update } = crud(
  schema,
  "images",
  internalQuery,
  internalMutation,
);

export const getUrl = query({
  args: { id: v.id("images") },
  handler: async (ctx, args) => {
    return (await ctx.db.get(args.id))?.url;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Verify the user is authenticated
    const viewer = await getViewer(ctx, {});
    if (!viewer)
      throw new Error("User not authenticated; cannot generate upload URL");

    // Return an upload URL
    return await ctx.storage.generateUploadUrl();
  },
});

const imageFields = schema.tables.images.validator.fields;
export const saveOptimized = mutation({
  args: omit(imageFields, ["url"]),
  handler: async (ctx, args) => {
    // Verify the user is still authenticated
    const viewer = await getViewer(ctx, {});
    if (!viewer) throw new Error("User not authenticated; cannot save file");

    // Save the original file metadata & storageId to 'images' table
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error(`No url found for storageId ${args.storageId}`);
    const imageId = await ctx.db.insert("images", { ...args, url });

    // Trigger the optimizeAndSave action
    await ctx.scheduler.runAfter(0, internal.sharp.convertAndUpdate, {
      imageId,
    });
    return (await ctx.db.get(imageId))!;
  },
});

export const save = mutation({
  args: omit(imageFields, ["url"]),
  handler: async (ctx, args) => {
    // Verify the user is still authenticated
    const viewer = await getViewer(ctx, {});
    if (!viewer) throw new Error("User not authenticated; cannot save file");

    // Get the URL
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error(`No url found for storageId ${args.storageId}`);

    // Save the file metadata, url & storageId to 'images' table
    const docId = await ctx.db.insert("images", { ...args, url });
    return (await ctx.db.get(docId))!;
  },
});
