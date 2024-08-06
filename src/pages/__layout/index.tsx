import type { FC } from 'react'
import { PreviewGallery } from '@/components/Blog/Post'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { EditorToolbar } from '@/components/Blog/Edit'

const Component: FC = () => {
    const posts = useQuery(api.posts.list);
    return (<>
        <EditorToolbar post={'new'} />
        <div className="container">
            {posts && <PreviewGallery posts={posts} />}
        </div>
    </>);
}

export default Component