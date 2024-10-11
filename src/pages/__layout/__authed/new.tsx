import { Authenticated, Unauthenticated } from "convex/react";

import { EditablePost } from "@/components/Blog/Edit";

export default function NewPostPage() {
  return (
    <>
      <Authenticated>
        <EditablePost version={null} />
      </Authenticated>
      <Unauthenticated>
        {/* Should never get here, but just in case */}
        Sign in as an editor to access this page
      </Unauthenticated>
    </>
  );
}
