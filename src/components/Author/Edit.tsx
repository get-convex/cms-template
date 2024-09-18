import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form } from "@/components/ui/form";
import { useState, type FormEventHandler } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Toolbar } from "@/components/Toolbar";
import { TextField, MarkdownField } from "@/components/Inputs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Doc } from "../../../convex/_generated/dataModel";
import { usersZod } from "../../../convex/schema";
import { AuthorProfile } from "./Profile";

export function EditableProfile({ user }: { user: Doc<'users'> }) {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [previewing, setPreviewing] = useState(false);

    const update = useMutation(api.users.update);

    const zodSchema = z.object(usersZod);
    const defaultValues = user;


    const form = useForm<z.infer<typeof zodSchema>>({
        defaultValues,
        resolver: zodResolver(zodSchema),
    });


    const onReset = () => {
        form.reset(defaultValues);
        navigate(`/authors/${user._id}`)
    };


    const onSubmit: SubmitHandler<z.infer<typeof zodSchema>> =
        async (data) => {
            try {
                await update({ id: user._id, patch: data });
                toast({
                    title: "User Profile Updated",
                });
                form.reset(data);
                navigate(`/authors/${user._id}`)
            } catch (e) {
                const error = e as Error;
                toast({
                    variant: "destructive",
                    title: "Error Updating Profile",
                    description: error.message,
                })
            }
        };

    // Wrapper for form.handleSubmit to avoid no-misused-promises error;
    // see https://github.com/orgs/react-hook-form/discussions/8020
    const submitHandler: FormEventHandler = (...args) => void form.handleSubmit(onSubmit)(...args)

    const { isValid, isDirty } = form.formState;
    const values = form.getValues();

    return (<>
        <Toolbar>
            <div className="w-full flex max-sm:flex-col sm:flex-row gap-2 justify-between items-center">
                <div className="flex gap-2 items-center">

                    <Switch id="editing"
                        checked={previewing}
                        onCheckedChange={(checked) => setPreviewing(checked)} />
                    <Label htmlFor="editing">Preview</Label>
                </div>

                <div className={`flex gap-2 items-center`}>
                    <Button variant="outline" onClick={onReset}>
                        {isDirty ? 'Discard' : 'Cancel'}
                    </Button>

                    <Button onClick={submitHandler}
                        disabled={!isValid || !isDirty}>
                        Save
                    </Button>
                </div>
            </div>
        </Toolbar>
        <div className="container my-8" >
            {previewing
                ? <AuthorProfile user={{ ...user, ...values }} />
                : <Form {...form}>
                    <form onSubmit={submitHandler} >
                        <TextField name="name" form={form} />
                        <TextField name="image" form={form} />
                        <TextField name="slug" form={form} />
                        <TextField name="url" form={form} />
                        <TextField name="email" form={form} />
                        <MarkdownField name="tagline" rows={1} form={form} />
                        <MarkdownField name="bio" rows={5} form={form} />
                    </form>
                </Form>}
        </div>
    </>)

}