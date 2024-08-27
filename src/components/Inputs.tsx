import { Input } from "./ui/input";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadDropzone, type UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import type { Id } from "../../convex/_generated/dataModel";

interface CommonProps<Schema extends FieldValues> {
    name: FieldPath<Schema>;
    form: UseFormReturn<Schema>;
}

interface TextFieldProps<Schema extends FieldValues> extends CommonProps<Schema> {
    hidden?: boolean;
    required?: boolean;
}

export function TextField<Schema extends FieldValues>({ name, form, hidden, required }: TextFieldProps<Schema>) {
    const ifRequired = (required
        ? { required: true, "aria-required": true }
        : {})
    return (<FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem className="grid grid-cols-4 gap-4 mb-4 items-center">
                <div className="col-span-1 row-span-2 text-right">
                    <FormLabel className="text-primary">
                        {name}{required && '*'}
                    </FormLabel>
                    <FormMessage className="w-full text-convex-yellow italic" />
                </div>
                <FormControl className="col-span-3 row-span-2">
                    <Input
                        type={hidden ? 'hidden' : 'text'}
                        {...field}
                        onBlur={() => void form.trigger()}
                        {...ifRequired} />
                </FormControl>

            </FormItem>
        )}
    />);

}


interface MarkdownFieldProps<Schema extends FieldValues> extends TextFieldProps<Schema> {
    rows?: number;
}

export function MarkdownField<Schema extends FieldValues>(
    { name, form, rows, required }: MarkdownFieldProps<Schema>
) {
    const ifRequired = (required
        ? { required: true, "aria-required": true }
        : {})
    return (<FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem className="grid grid-cols-4 gap-4 mb-4 items-center">
                <div className="col-span-1 row-span-2 text-right">
                    <FormLabel className="text-primary font-mono">
                        {name}{required && '*'}
                    </FormLabel>
                    <FormDescription>Markdown allowed</FormDescription>
                    <FormMessage className="w-full text-convex-yellow italic" />
                </div>
                <FormControl className="col-span-3 row-span-2">
                    <Textarea
                        rows={rows || 5} {...field}
                        onBlur={() => void form.trigger()}
                        {...ifRequired} />
                </FormControl>
            </FormItem>
        )}
    />);

}

interface ImageFieldProps<Schema extends FieldValues> extends CommonProps<Schema> {
    userId: Id<'users'>
}

export function ImageField<Schema extends FieldValues>({ name, form, userId }: ImageFieldProps<Schema>) {
    const generateUploadUrl = useMutation(api.images.generateUploadUrl);
    const save = useMutation(api.images.save);
    const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
        const { name, type, size, response } = uploaded[0];
        const { storageId } = (response as { storageId: Id<'_storage'> });
        await save({
            name,
            type,
            size,
            storageId,
            authorId: userId
        });
    };


    return (
        <FormField
            control={form.control}
            name={name}
            render={() => (
                <FormItem className="grid grid-cols-4 gap-4 mb-4 items-center">
                    <div className="col-span-1 row-span-2 text-right">
                        <FormLabel className="text-primary">
                            {name}
                        </FormLabel>
                        <FormMessage className="w-full text-convex-yellow italic" />
                    </div>
                    <FormControl className="col-span-3 row-span-2">
                        <UploadDropzone
                            uploadUrl={generateUploadUrl}
                            fileTypes={{
                                "application/pdf": [".pdf"],
                                "image/*": [".png", ".gif", ".jpeg", ".jpg"],
                            }}
                            onUploadComplete={saveAfterUpload}
                            onUploadError={(error: unknown) => {
                                // Do something with the error.
                                alert(`ERROR! ${error}`);
                            }}
                        />
                    </FormControl>

                </FormItem>
            )}
        />

    );
}