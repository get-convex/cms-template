import { Input } from "./ui/input";
import type { FieldPath, FieldValue, FieldValues, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadButton, type UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import type { Id } from "../../convex/_generated/dataModel";
import { useToast } from "./ui/use-toast";

interface CommonProps<Schema extends FieldValues> {
    name: FieldPath<Schema>;
    form: UseFormReturn<Schema>;
}

interface TextFieldProps<Schema extends FieldValues> extends CommonProps<Schema> {
    hidden?: boolean;
    required?: boolean;
    itemClass?: string;
    controlClass?: string;
}

export function TextField<Schema extends FieldValues>({
    name, form, hidden, required, itemClass, controlClass
}: TextFieldProps<Schema>) {
    const ifRequired = (required
        ? { required: true, "aria-required": true }
        : {})
    return (<FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem className={itemClass || "grid grid-cols-4 gap-4 mb-4 items-center"}>
                <div className="col-span-1 row-span-2 text-right">
                    <FormLabel className="text-primary">
                        {name}{required && '*'}
                    </FormLabel>
                    <FormMessage className="w-full text-convex-yellow italic" />
                </div>
                <FormControl className={controlClass || "col-span-3 row-span-2"}>
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

export function ImageField<Schema extends FieldValues>({ form }: CommonProps<Schema>) {
    const { toast } = useToast();

    const generateUploadUrl = useMutation(api.images.generateUploadUrl);
    const save = useMutation(api.images.save);

    const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
        const { name, type, size, response } = uploaded[0];
        const { storageId } = (response as { storageId: Id<'_storage'> });
        const image = await save({
            name,
            type,
            size,
            storageId,
        });
        if (!image) {
            toast({
                title: 'Error saving file',
                description: `images:save returned null for storageId ${storageId}`
            })
        } else {
            toast({
                title: `Saved image file ${name}`,
                description: `URL: ${image.url}`
            });
            form.setValue('imageUrl' as FieldPath<Schema>,
                image.url as FieldValue<Schema>,
                { shouldDirty: true });
        }

    };

    return (<div className="grid grid-cols-4 gap-x-4 items-center">
        <TextField name={"imageUrl" as FieldPath<Schema>} form={form}
            itemClass="space-y-2 grid grid-cols-subgrid col-span-3 gap-4 mb-4 items-center" controlClass="col-span-2 row-span-2" />
        <div className="col-start-4 col-span-1 pb-2">
            <UploadButton
                uploadUrl={generateUploadUrl}
                fileTypes={[".png", ".gif", ".jpeg", ".jpg"]}
                onUploadComplete={saveAfterUpload}
                onUploadError={(error: unknown) => {
                    toast({
                        title: 'Error uploading image',
                        description: `Error: ${error}`
                    })
                }}
                content={(progress) => progress ? 'Uploading...' : 'Upload image'}
            />
        </div>
    </div>

    )
};
