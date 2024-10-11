import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Message, PageTitle } from "@/components/PageTitle";
import { AuthorsList } from "@/components/Author/Profile";

export default function AuthorsPage() {
  const users = useQuery(api.users.listAuthors);

  return (
    <>
      <div className="container">
        <PageTitle title="Authors" />
      </div>
      {users === undefined ? (
        <Message text="Loading..." />
      ) : (
        <AuthorsList users={users} />
      )}
    </>
  );
}
