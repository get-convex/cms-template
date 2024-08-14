import { AuthorImage, type Author } from "./Author";
import { PageTitle } from "./PageTitle";


const authorsGridClass = "w-full grid grid-cols-2 items-center gap-2 pb-4"
export function AdminDashboard({ authors }: { authors?: Author[] }) {
    return <>
        <PageTitle title="Authors" />
        <div className={authorsGridClass}>
            <div>User</div>
            <div>Role</div>
        </div>
        {authors?.length ? authors.map(a => {
            return <div className={authorsGridClass} key={a._id}>
                <div className="flex gap-2 items-center">
                    <AuthorImage src={a.user?.image} />
                    {a.user?.name}</div>
                <div>{a.isAdmin ? 'Admin' : 'Editor'}</div>

            </div>
        }) : 'No authors found'}


    </>
}