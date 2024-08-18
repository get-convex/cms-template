import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { MarkdownField, TextField } from "@/components/Inputs";
import { Button } from "@/components/ui/button";
import { versionsZod } from "../../../convex/schema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "../ui/label";
import { DisplayPost, type Post } from "./Post";
import { useNavigate } from "react-router-dom";
import { VersionHistory } from "@/components/Blog/History";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { Toolbar } from "../Toolbar";

export const versionDefaults: { [F in keyof typeof versionsZod]: string } = {
    postId: '',
    slug: '',
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    authorId: '',
    editorId: ''
}


export function EditablePost({ version }: { version: Doc<'versions'> | null }) {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [previewing, setPreviewing] = useState(false);
    const [versionId, setVersionId] = useState(version?._id);

    const viewer = useQuery(api.users.viewer);

    const createVersion = useMutation(api.versions.create);
    const publishPost = useMutation(api.posts.publish);
    const updatePost = useMutation(api.posts.update);

    const zodSchema = z.object(versionsZod);
    const defaultValues = version || versionDefaults;

    useEffect(() => {
        if (viewer) {
            if (!form.getValues('authorId') && viewer) {
                form.setValue('authorId', viewer._id);
            }
            form.setValue('editorId', viewer._id)
        }
    }, [viewer])


    const form = useForm<z.infer<typeof zodSchema>>({
        defaultValues,
        resolver: zodResolver(zodSchema)
    });

    const onReset = () => {
        form.reset(defaultValues);
        const back = version ? `/${version.slug}?v=${versionId}` : `/`;
        navigate(back);
    };

    const onRestore = (id: Id<'versions'>) => {
        setVersionId(id);
        toast({
            title: `Now editing version ${id}`,
            description: `Publish to restore this version, or edit and save as a new version`
        });
    }

    const onPublish: SubmitHandler<z.infer<typeof zodSchema>> =
        async (data) => {
            // if (!data.postId) {
            //     // Unless there is already a postId set,
            //     // copy the slug as postId (for history)
            //     data.postId = data.slug;
            // }
            try {
                const newVersion = await createVersion({ ...data });
                if (!newVersion) throw new Error('Error saving version');

                const updatedPost = await publishPost({
                    versionId: newVersion._id
                });
                if (!updatedPost) throw new Error('Error updating post');

                toast({
                    title: "Post published",
                    description: `Published version ${newVersion._id} of post ${updatedPost._id}`
                });
                form.reset(data);
                navigate(`/${newVersion.slug}`)
            } catch (e) {
                const error = e as Error;
                toast({
                    variant: "destructive",
                    title: "Error publishing post",
                    description: error.message,
                })
            }
        };

    const { isValid, isDirty } = form.formState;

    return (<>
        <Toolbar>

            <div className="flex flex-row justify-between items-center">

                <div className="flex gap-2 items-center">

                    <Switch id="editing"
                        checked={previewing}
                        onCheckedChange={(checked) => setPreviewing(checked)} />
                    <Label htmlFor="editing" className="text-primary">Preview</Label>
                </div>

                {version && <VersionHistory postId={version.postId}
                    currentVersion={version._id}
                    onRestore={onRestore}
                    disabled={isDirty} />}

                <div className={`flex gap-2 items-center`}>
                    <Button variant="secondary" onClick={onReset}>
                        {isDirty ? 'Discard' : 'Cancel'}
                    </Button>

                    <Button variant="outline"
                        onClick={form.handleSubmit(onSaveDraft(false))}
                        disabled={!isValid || !isDirty}>
                        Save draft
                    </Button>

                    <Button onClick={form.handleSubmit(onPublish)}
                        disabled={!isValid || !isDirty}>
                        Publish
                    </Button>
                </div>
            </div>
        </Toolbar>

        {previewing
            ? (<div className="my-8" >
                <DisplayPost post={{ ...version, ...form.getValues() }} />
            </div>)
            : <Form {...form}>
                <form onSubmit={form.handleSubmit(onSaveDraft)} >
                    <div className="container">
                        <TextField name="title" form={form} />
                        <TextField name="slug" form={form} />
                        <TextField name="imageUrl" form={form} />
                        <MarkdownField name="summary" rows={3} form={form} />
                        <MarkdownField name="content" rows={10} form={form} />
                    </div>
                </form>
            </Form>}

    </>)

}