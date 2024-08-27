import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState, type MouseEventHandler } from "react";
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
import { DisplayPost, type PostOrVersion } from "./Post";
import { useNavigate, useSearchParams } from "react-router-dom";
import { VersionHistory } from "@/components/Blog/History";
import { Toolbar } from "../Toolbar";
import type { Doc } from "../../../convex/_generated/dataModel";

const versionDefaults = {
    postId: '',
    slug: '',
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    authorId: '',
    editorId: '',
    published: false
}

export function EditablePost({ version }: { version: Doc<'versions'> | null }) {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [_, setSearchParams] = useSearchParams();

    const [previewing, setPreviewing] = useState(false);

    const viewer = useQuery(api.users.viewer);

    const saveDraft = useMutation(api.versions.saveDraft);
    const publishPost = useMutation(api.posts.publish);

    const zodSchema = z.object(versionsZod);
    const defaultValues = version || versionDefaults;


    const form = useForm<z.infer<typeof zodSchema>>({
        defaultValues,
        resolver: zodResolver(zodSchema)
    });

    const { getValues, setValue } = form;

    useEffect(() => {
        if (viewer) {
            if (!getValues('authorId') && viewer) {
                setValue('authorId', viewer._id);
            }
            setValue('editorId', viewer._id)
        }
    }, [viewer, getValues, setValue])

    const onSaveDraft: SubmitHandler<Schema> =
        async (data) => {
            try {
                const newVersion = await saveDraft({
                    ...data,
                    published: false
                });
                if (!newVersion) throw new Error('Error saving draft');

                toast({
                    title: "Draft saved",
                    description: `Saved new draft version ${newVersion._id}. This draft is not published yet.`
                });

                if (newVersion.slug !== version?.slug) {
                    navigate(`/${newVersion.slug}/edit?v=${newVersion._id}`)
                } else {
                    setSearchParams((params) => (
                        { ...params, v: newVersion._id }
                    ))
                }
            } catch (e) {
                const error = e as Error;
                toast({
                    variant: "destructive",
                    title: "Error saving draft",
                    description: error.message,
                })
            }
        }

    const onPublish: SubmitHandler<Schema> =
        async (data) => {
            try {
                const newVersion = await saveDraft({ ...data, published: true });
                if (!newVersion) throw new Error('Error saving version');

                const updatedPost = await publishPost({
                    versionId: newVersion._id
                });
                if (!updatedPost) throw new Error('Error publishing post');

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

    // Wrapper for form.handleSubmit to circumvent a react-hook-form issue
    // that makes TSC throw a @typescript-eslint/no-misused-promises error;
    // see https://github.com/orgs/react-hook-form/discussions/8020
    const handleSubmit = function (handler: SubmitHandler<Schema>): MouseEventHandler {
        return (...args) => void form.handleSubmit(handler)(...args)
    }



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

                {version &&
                    <VersionHistory
                        postId={version.postId}
                        currentVersion={version._id}
                        isDirty={isDirty} />}

                <div className={`flex gap-2 items-center`}>
                    <Button variant="secondary" type="reset"
                        onClick={() => {
                            const cancelled = !isDirty;
                            form.reset(defaultValues);
                            if (cancelled) navigate(-1);
                        }}>
                        {isDirty ? 'Reset' : 'Cancel'}
                    </Button>

                    <Button variant="outline"
                        type="button"
                        onClick={handleSubmit(onSaveDraft)}
                        disabled={!isValid || !isDirty}>
                        Save draft
                    </Button>

                    <Button onClick={handleSubmit(onPublish)}
                        type="button"
                        disabled={!isValid
                            || (form.getValues('published') && !isDirty)}>
                        Publish
                    </Button>
                </div>
            </div>
        </Toolbar>

        {previewing
            ? (<div className="my-8" >
                <DisplayPost post={{ ...version, ...form.getValues() } as PostOrVersion} />
            </div>)
            : <Form {...form}>
                <form>
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