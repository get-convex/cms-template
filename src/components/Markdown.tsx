import type { ReactNode } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export function StyledContent({ children }: { children: ReactNode }) {
    return <div className="prose prose-zinc prose-a:text-convex-purple  dark:prose-invert dark:prose-a:text-convex-yellow">
        {children}
    </div>
}

export function StyledMarkdown({ content }: { content: string }) {
    return <StyledContent>
        <Markdown
            rehypePlugins={[rehypeHighlight]}
            remarkPlugins={[remarkGfm]} >
            {content}
        </Markdown>
    </StyledContent>
}