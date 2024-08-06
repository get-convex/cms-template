import { Input } from "../ui/input";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";



interface TextFieldProps<Schema extends FieldValues> {
    name: string;
    form: UseFormReturn<Schema>;
    rows?: number;
    hidden?: boolean;
}


export function TextField({ name, form, hidden }: TextFieldProps<any>) {

    return (<FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem className="grid grid-cols-4 gap-4 mb-4 items-center">
                <div className="col-span-1 row-span-2 text-right">
                    <FormLabel className="text-primary">{name}</FormLabel>
                    <FormMessage className="w-full text-convex-yellow italic" />
                </div>
                <FormControl className="col-span-3 row-span-2">
                    <Input
                        type={hidden ? 'hidden' : 'text'}
                        {...field}
                        onBlur={() => form.trigger()} />
                </FormControl>

            </FormItem>
        )}
    />);

}



export function MarkdownField({ name, form, rows }: TextFieldProps<any>) {

    return (<FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem className="grid grid-cols-4 gap-4 mb-4 items-center">
                <div className="col-span-1 row-span-2 text-right">
                    <FormLabel className="text-primary font-mono">{name}</FormLabel>
                    <FormMessage className="w-full text-convex-yellow italic" />
                </div>
                <FormControl className="col-span-3 row-span-2">
                    <Textarea rows={rows || 5} {...field} onBlur={() => form.trigger()} />
                </FormControl>
            </FormItem>
        )}
    />);

}