import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { EditorToolbar } from "@/components/Blog/Edit";
import { TextField, MarkdownField } from "@/components/Inputs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Doc } from "../../../convex/_generated/dataModel";
import { usersZod } from "../../../convex/schema";
import { CompactProfile } from "./Profile";

export function EditableProfile({ user }: { user: Doc<'users'> }) {
    const viewer = useQuery(api.users.viewer);

    const { toast } = useToast();
    const navigate = useNavigate();

    const [previewing, setPreviewing] = useState(false);

    const update = useMutation(api.users.update);

    const zodSchema = z.object(usersZod);
    const defaultValues = user;

    const form = useForm<z.infer<typeof zodSchema>>({
        defaultValues,
        resolver: zodResolver(zodSchema)
    });

    const onReset = () => {
        form.reset(defaultValues);
    };

    const onSubmit: SubmitHandler<z.infer<typeof zodSchema>> =
        async (data) => {
            try {
                await update({ id: user._id, patch: data });
                toast({
                    title: "User Profile Updated",
                });
                form.reset(data);
                navigate(`/users/${user._id}`)
            } catch (e) {
                const error = e as Error;
                toast({
                    variant: "destructive",
                    title: "Error Updating Profile",
                    description: error.message,
                })
            }
        };

    const { isValid, isDirty } = form.formState;

    if (viewer?._id !== user._id) {
        return <p className="container">You do not have permission to edit this user's profile.</p>
    }

    return (<>
        <EditorToolbar>
            <div className="flex gap-2 items-center">

                <Switch id="editing"
                    checked={previewing}
                    onCheckedChange={(checked) => setPreviewing(checked)} />
                <Label htmlFor="editing">Preview</Label>
            </div>

            <div className={`flex gap-2 items-center`}>
                <Button variant="outline" onClick={onReset} disabled={!isDirty}>
                    Discard changes
                </Button>

                <Button onClick={form.handleSubmit(onSubmit)}
                    disabled={!isValid || !isDirty}>
                    Save changes
                </Button>
            </div>
        </EditorToolbar>
        <div className="container my-8" >
            {previewing
                ? <CompactProfile user={user} />
                : <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <TextField name="name" form={form} />
                        <TextField name="image" form={form} />
                        <TextField name="url" form={form} />
                        <MarkdownField name="tagline" rows={3} form={form} />
                        <MarkdownField name="bio" rows={10} form={form} />
                    </form>
                </Form>}
        </div>
    </>)

}