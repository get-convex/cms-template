import type { FC } from 'react'
import { PreviewGallery } from '@/components/Blog/Post'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Toolbar } from '@/components/Toolbar'
import { Button } from '@/components/ui/button'
import { FilePlusIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'

const Component: FC = () => {
    const posts = useQuery(api.posts.list);
    return (<>
        <Toolbar>
            <Link to={`/new`} className={`flex gap-2 items-center`} >
                <Button>
                    New post
                    <FilePlusIcon className="h-6 w-6 pl-2" />
                </Button>
            </Link>
        </Toolbar>
        <div className="container">
            {posts && <PreviewGallery posts={posts} />}
        </div>
    </>);
}

export default Component