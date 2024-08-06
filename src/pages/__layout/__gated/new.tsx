import { Authenticated, Unauthenticated } from "convex/react";

import { EditablePost } from "@/components/Blog/Edit";


export default () => {
    return (<>
        <Authenticated>
            <EditablePost post={null} />
        </Authenticated>
        <Unauthenticated>
            {/* Should never get here, but just in case */}
            Sign in as an editor to access this page
        </Unauthenticated>
    </>)
}