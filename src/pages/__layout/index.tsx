import { PreviewGallery } from '@/components/Blog/Post'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Toolbar } from '@/components/Toolbar'
import { Button } from '@/components/ui/button'
import { FilePlusIcon } from '@radix-ui/react-icons'
import { Link, useSearchParams } from 'react-router-dom'
import { PageTitle } from '@/components/PageTitle'
import type { FC } from 'react'

const Component: FC = () => {
    const [searchParams, _] = useSearchParams();
    const searchTerm = searchParams.get('s');
    const searchResults = useQuery(api.posts.searchContent, searchTerm ? { searchTerm } : 'skip')
    const allPosts = useQuery(api.posts.list);

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
            <div className="mt-4">
                {searchTerm
                    ? searchResults && <PreviewGallery posts={searchResults} />
                    : allPosts && <PreviewGallery posts={allPosts} />}
            </div>
        </div>
    </>);
}

export default Component