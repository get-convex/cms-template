import { Input } from "./ui/input";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "./ui/form";
import { Textarea } from "./ui/textarea";



interface TextFieldProps<Schema extends FieldValues> {
    name: FieldPath<Schema>;
    form: UseFormReturn<Schema>;
    hidden?: boolean;
    required?: boolean;
}

interface MarkdownFieldProps<Schema extends FieldValues> extends TextFieldProps<Schema> {
    rows?: number;
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
                        onBlur={() => form.trigger()}
                        {...ifRequired} />
                </FormControl>

            </FormItem>
        )}
    />);

}



export function MarkdownField(
    { name, form, rows, required }: MarkdownFieldProps<any>
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
                        onBlur={() => form.trigger()}
                        {...ifRequired} />
                </FormControl>
            </FormItem>
        )}
    />);

}