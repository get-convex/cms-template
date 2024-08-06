import { ArrowRightIcon, ClockIcon, EyeNoneIcon, EyeOpenIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Post } from "./Post";
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { showTimeAgo } from "@/lib/utils";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";


interface RestoreProps {
    onRestore: (id: Id<'posts'>) => void;
    disabled: boolean;
}

export function VersionHistory({ postId, currentVersion, onRestore, disabled }: {
    postId: Post['postId'];
    currentVersion: Id<'posts'>;
} & RestoreProps) {
    const { toast } = useToast();
    const versions = useQuery(api.posts.getVersionStats, {
        postId,
        includeHistory: true
    });
    const totalCount = versions?.counts.all;

    const [versionId, _] = useState(currentVersion as string);


    useEffect(() => {
        toast({
            title: `Editing version ${versionId}`,
            description: `Publish to restore this version, or edit and save as a new version`
        });
    }, [versionId])


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="mx-0 flex gap-2 items-center">
                    <ClockIcon />
                    <p>History</p>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="flex gap-2 items-center">
                    {totalCount
                        ? `${totalCount} Version${totalCount === 1 ? '' : 's'}`
                        : 'Version History'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="w-full h-52">
                    {versions?.history?.map(
                        (version) => <HistoryDropdownItem
                            key={version._id}
                            selected={version._id === versionId}
                            post={version}
                            onRestore={onRestore}
                            disabled={disabled} />
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function HistoryDropdownItem({ post, selected, disabled }: {
    post: Doc<'posts'>;
    selected: boolean;
} & RestoreProps) {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { _id, _creationTime, published } = post;
    const created = new Date(_creationTime).toUTCString();
    const ago = showTimeAgo(_creationTime);

    const viewing = selected ? 'Currently viewing this version' : 'Click to restore this version';
    const details = `${published ? 'Published' : 'Draft'} at ${created}`;

    return <DropdownMenuItem key={post._id}
        className={`w-full text-sm mx-0 py-2 px-0 whitespace-nowrap stroke-background hover:stroke-current ${!published && 'text-muted-foreground'}`} title={[viewing, details].join('\n')}>
        <Button
            variant='ghost'
            className={`w-full mx-0 gap-2 flex items-center justify-start  font-normal ${selected ? 'text-convex-yellow stroke-convex-yellow disabled:opacity-100' : ''}`}
            onClick={() => navigate(pathname + `?v=${_id}`)}
            disabled={disabled || selected}
        >
            {selected ? <ArrowRightIcon /> : <ReloadIcon />}
            <div className="text-current">{
                published ? 'Published' : 'Drafted'
            }</div>
            <span>{ago}</span>
        </Button>
    </DropdownMenuItem>
}

// @ts-expect-error (unused)
function HistoryDropdownRadioItem({ post, selected, disabled }: {
    post: Doc<'posts'>;
    selected: boolean;
} & RestoreProps) {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { _id, _creationTime, published } = post;
    const created = new Date(_creationTime);
    const ago = showTimeAgo(_creationTime);
    const detailed = `${published ? 'Published' : 'Draft'} at ${created.toUTCString()}
Click to restore this version
`

    return <DropdownMenuRadioItem key={post._id}
        value={post._id}
        className={`w-full text-sm mx-0 py-2 px-0 whitespace-nowrap stroke-background hover:stroke-current ${!published && 'text-muted-foreground'}`}>
        <Button
            variant='ghost'
            className="w-full mx-0 gap-2 flex items-center justify-start  font-normal"
            title={detailed}
            onClick={() => navigate(pathname + `?v=${_id}`)}
            disabled={disabled}
        >
            {selected ? <ArrowRightIcon className="stroke-convex-yellow" /> : <ReloadIcon />}
            <div className="stroke-current">{
                published ? <EyeOpenIcon /> : <EyeNoneIcon />
            }</div>
            <span>{ago}</span>
        </Button>
    </DropdownMenuRadioItem>
}

