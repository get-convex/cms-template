import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AdminDashboard } from '@/components/Admin/Dashboard';
import { Button } from "@/components/ui/button";

export default function AdminOnly() {
    const user = useQuery(api.users.viewer);
    const author = useQuery(api.authors.viewer);
    const authors = useQuery(api.authors.list);
    const createAdmin = useMutation(api.authors.createFirstAuthor);


    if (!user || (author && !author.isAdmin)) {
        return <h2>Log in as an admin user to access this page</h2>;
    }
    return (<div className="container">

        {authors && authors.length === 0
            ? <div className="container">
                <p>Your project does not have any Admins yet.</p>
                <Button onClick={async () => await createAdmin()} >
                    Make me an Admin
                </Button>
            </div>
            : <AdminDashboard authors={authors} />}
    </div>);
}
