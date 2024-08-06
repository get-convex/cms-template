import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export function StyledMarkdown({ content }: { content: string }) {
    return <div className="prose prose-zinc prose-a:text-convex-purple  dark:prose-invert dark:prose-a:text-convex-yellow">
        <Markdown
            rehypePlugins={[rehypeHighlight]}
            remarkPlugins={[remarkGfm]} >
            {content}
        </Markdown>
    </div>
}