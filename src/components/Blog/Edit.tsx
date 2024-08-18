import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { MarkdownField, TextField } from "@/components/Inputs";
import { Button } from "@/components/ui/button";
import { postsZod } from "../../../convex/schema";
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
import type { Id } from "../../../convex/_generated/dataModel";
import { Toolbar } from "../Toolbar";

export const postsDefaults = {
    slug: '',
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    authorId: '',
    published: false,
    postId: ''
}


export function EditablePost({ post }: { post: Post | null }) {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [previewing, setPreviewing] = useState(false);
    const [versionId, setVersionId] = useState(post?._id);

    const viewer = useQuery(api.users.viewer);

    const update = useMutation(api.posts.update);

    const zodSchema = z.object(postsZod);
    const defaultValues = post || postsDefaults;

    useEffect(() => {
        if (!form.getValues('authorId') && viewer) {
            form.setValue('authorId', viewer._id);
        }
    }, [viewer])


    const form = useForm<z.infer<typeof zodSchema>>({
        defaultValues,
        resolver: zodResolver(zodSchema)
    });

    const formSlug = form.getValues('slug');
    const formPostId = form.getValues('postId');
    useEffect(() => {
        // Unless there is already a postId set,
        // copy over the slug as it changes
        if (!formPostId) {
            form.setValue('postId', formSlug);
        }
    }, [formSlug, formPostId])

    const onReset = () => {
        form.reset(defaultValues);
        const back = post ? `/${post.slug}?v=${versionId}` : `/`;
        navigate(back);
    };



    const onSubmit: (published: boolean) => SubmitHandler<z.infer<typeof zodSchema>> =
        (published) => async (data) => {
            if (!data.postId) {
                // Unless there is already a postId set,
                // copy the slug as postId (for history)
                data.postId = data.slug;
            }
            try {
                const result = await update({ ...data, published });
                if (!result) throw new Error('Update fn returned no document')
                toast({
                    title: "Post Updated",
                    description: `Updated ${result.slug}`
                });
                form.reset(data);
                navigate(`/${result.slug}?v=${result._id}`)
            } catch (e) {
                const error = e as Error;
                toast({
                    variant: "destructive",
                    title: "Error Updating Post",
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

                {post && <VersionHistory postId={post.postId}
                    currentVersion={post._id}
                    onRestore={(id: Id<'posts'>) => setVersionId(id)}
                    disabled={isDirty} />}

                <div className={`flex gap-2 items-center`}>
                    <Button variant="secondary" onClick={onReset}>
                        {isDirty ? 'Discard' : 'Cancel'}
                    </Button>

                    <Button variant="outline"
                        onClick={form.handleSubmit(onSubmit(false))}
                        disabled={!isValid || !isDirty}>
                        Save draft
                    </Button>

                    <Button onClick={form.handleSubmit(onSubmit(true))}
                        disabled={!isValid || (!isDirty && post?.published)}>
                        Publish
                    </Button>
                </div>
            </div>
        </Toolbar>

        {previewing
            ? (<div className="my-8" >
                <DisplayPost post={{ ...post, ...form.getValues() }} />
            </div>)
            : <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit(false))} >
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