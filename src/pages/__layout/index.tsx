import type { FC } from 'react'
import { PreviewGallery } from '@/components/Blog/Post'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Toolbar } from '@/components/Toolbar'
import { Button } from '@/components/ui/button'
import { FilePlusIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'
import { PageTitle } from '@/components/PageTitle'

const Component: FC = () => {
    const posts = useQuery(api.posts.list);
    return (<>
        <Toolbar>
            <div className="w-full flex justify-end">
                <Link to={`/new`} className={`flex gap-2 items-center`} >
                    <Button>
                        New post
                        <FilePlusIcon className="h-6 w-6 pl-2" />
                    </Button>
                </Link>
            </div>
        </Toolbar>

        <div className="container">
            <PageTitle title="" tagline="A minimalist CMS / Blog open-source template created with Convex, Vite, React and shadcn/ui." />
            <div className="mt-4">{posts && <PreviewGallery posts={posts} />}</div>
        </div>
    </>);
}

export default Component