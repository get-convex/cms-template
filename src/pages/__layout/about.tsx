import { GetStartedContent } from '@/components/GetStarted/GetStartedDialog'
import { PageTitle } from '@/components/PageTitle'

export default function AboutPage() {
    return (<div className="container">
        <PageTitle
            title='About'
            tagline="A minimalist CMS/Blog open-source template created with Convex, Vite, React and shadcn/ui."
        />
        <GetStartedContent />
    </div>);
}