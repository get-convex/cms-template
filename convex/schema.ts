import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { z, type ZodString } from "zod";
import { Table } from "convex-helpers/server";
import { zid, zodToConvexFields } from "convex-helpers/server/zod";

//// Zod validation helpers ////
const required = { required_error: "Required" };
export const slugRegEx = /^(\w+)((-\w+)+)?$/;
export const zodSlug = z
  .string(required)
  .regex(
    slugRegEx,
    "Slug can only contain letters, numbers, hyphens or underscores"
  );
// Accept empty strings in addition to undefined for form validation
export const zodOptionalString = (zs?: ZodString) => z.optional(
  z.union([z.literal(""), zs || z.string()])
);
const zodOptionalUrl = zodOptionalString(z.string().url());


//// Content schema & Validation ////

// When a new post is created, we add a new `posts` document.
// To track version history, each time a post is edited
// (published or not) we add a new `versions` document with the
// edited content, adding metadata like editorId. 
// When a version is (un)published, we update the `posts` document
// with the given version content, and metadata like the publishTime.
export const postContentZod = {
  title: z
    .string(required)
    .min(2)
    .max(60),
  slug: zodSlug,
  summary: zodOptionalString(z.string().min(10, '10 characters min').max(200, '200 characters max')),
  content: z.string(),
  imageUrl: zodOptionalUrl,
  authorId: zid("users"),
  published: z.boolean(),
}
export const postsZod = {
  ...postContentZod,
  publishTime: z.optional(z.number()),
  updateTime: z.optional(z.number()),
  // deprecated
  postId: zodOptionalString()
};
export const posts = Table('posts', zodToConvexFields(postsZod));

export const versionsZod = {
  ...postContentZod,
  postId: zid('posts'),
  editorId: zid('users'),
}
export const versions = Table('versions', zodToConvexFields(versionsZod))

export const usersZod = {
  image: zodOptionalUrl,
  url: zodOptionalUrl,
  tagline: zodOptionalString(z.string().max(100, '100 characters max')),
  bio: zodOptionalString(z.string().max(500, '500 characters max')),
  name: zodOptionalString(),
  email: zodOptionalString(z.string().email()),
  emailVerificationTime: z.optional(z.number()),
  phone: zodOptionalString(),
  phoneVerificationTime: z.optional(z.number()),
  isAnonymous: z.optional(z.boolean()),
  // deprecated
  userId: z.optional(zid('users')),
}
export const users = Table('users', zodToConvexFields(usersZod));

export const imagesZod = {
  name: zodOptionalString(),
  storageId: zid('_storage'),
  url: z.string().url()
}
export const images = Table('images', zodToConvexFields(imagesZod))

//// Convex DB ////
export default defineSchema({
  ...authTables,
  users: users.table,
  posts: posts.table
    .index("by_slug", ["slug"])
    .index("by_published", ["published", "publishTime", "updateTime"])
    .index("by_authorId", ["authorId"]),
  versions: versions.table
    .index("by_postId", ["postId"])
    .index("by_slug", ["slug"]), // to lookup old slugs for redirects
  images: images.table
    .index("by_storageID", ["storageId"])
});
