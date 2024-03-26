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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { date } from "zod";
import { Calendar } from "../ui/calendar";

export default function TextFormField({
  type,
  control,
  item,
  ...props
}: {
  type: "text" | "number";
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
            <Input {...field} type={type} />
          </FormControl>
          <FormDescription>{item.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
