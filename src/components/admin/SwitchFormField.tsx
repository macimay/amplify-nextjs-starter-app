import { InputDefineType } from "@/type/InputDefineType";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Control } from "react-hook-form";

import { Switch } from "../ui/switch";

export default function SwitchFormField({
  control,
  item,
  ...props
}: {
  control: Control<any, any>;
  item: InputDefineType;
}) {
  return (
    <FormField
      {...props}
      name={item.key}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={item.key}>{item.name}</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormDescription>{item.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
