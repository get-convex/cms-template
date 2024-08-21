import { ArrowRightIcon, ClockIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { showTimeAgo } from "@/lib/utils";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface RestoreProps {
    onRestore: (id: Id<'versions'>) => void;
    disabled: boolean;
}

export function VersionHistory({ postId, currentVersion, onRestore, disabled }: {
    postId: Id<'posts'>;
    currentVersion: Id<'versions'>;
} & RestoreProps) {
    const history = useQuery(api.versions.getPostHistory, { postId });
    const totalCount = history?.length;

    const [versionId, _] = useState(currentVersion as string);


    useEffect(() => {

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
                    {history?.map(
                        (v) => <HistoryDropdownItem
                            key={v._id}
                            selected={v._id === versionId}
                            version={v}
                            onRestore={onRestore}
                            disabled={disabled} />
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function HistoryDropdownItem({ version, selected, disabled }: {
    version: Doc<'versions'> & { editor: Doc<'users'>, author: Doc<'users'> };
    selected: boolean;
} & RestoreProps) {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { _id, _creationTime } = version;
    const created = new Date(_creationTime).toUTCString();
    const ago = showTimeAgo(_creationTime);

    const viewing = selected ? 'Currently viewing this version' : 'Click to restore this version';
    const details = `${version.editor.name} edited at ${created}`;

    return <DropdownMenuItem key={version._id}
        className={`w-full text-sm mx-0 py-2 px-0 whitespace-nowrap stroke-background hover:stroke-current`} title={[viewing, details].join('\n')}>
        <Button
            variant='ghost'
            className={`w-full mx-0 gap-2 flex items-center justify-start  font-normal ${selected ? 'text-convex-yellow stroke-convex-yellow disabled:opacity-100' : ''}`}
            onClick={() => navigate(pathname + `?v=${_id}`)}
            disabled={disabled || selected}
        >
            {selected ? <ArrowRightIcon /> : <ReloadIcon />}
            <div className="text-current">{version.editor.name}</div>
            <span>{ago}</span>
        </Button>
    </DropdownMenuItem>
}
