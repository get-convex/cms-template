import { useQuery } from "convex/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../../../../convex/_generated/api";
import { EditablePost } from "@/components/Blog/Edit";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { PostOrVersion } from "@/components/Blog/Post";

export function Message({ text }: { text: string }) {
  return <p className="container">{text}</p>;
}

export default function EditPostPage() {
  const { slug } = useParams();
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  // If we navigated here from a link on the site,
  // the searchParams should include a versionId
  const versionId = searchParams.get("v") as Id<"versions">;
  const versionById = useQuery(
    api.versions.getById,
    versionId ? { versionId, withUsers: true } : "skip",
  ) as PostOrVersion | undefined | null;

  // If we navigated here manually or the versionId
  // is otherwise missing, fall back to lookup by slug
  const postBySlug = useQuery(
    api.posts.getBySlug,
    versionId
      ? "skip"
      : {
          slug: slug!,
          withDraft: true,
          withAuthor: true,
        },
  ) as PostOrVersion | undefined | null;

  const post = versionById || postBySlug;

  if (post === undefined) return <Message text="Loading..." />;
  if (post == null) return <Message text="Not found" />;
  if (post.slug !== slug) {
    return navigate(`/${post.slug}/edit`);
  }
  return <EditablePost version={post} />;
}
