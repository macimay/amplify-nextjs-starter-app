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
import { OptionInputDefineType } from "@/type/OptionInputDefineType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function OptionsFormField({
  control,
  item,
  ...props
}: {
  control: Control<any, any>;
  item: InputDefineType;
}) {
  const optionItem = item as OptionInputDefineType;
  return (
    <FormField
      {...props}
      name={optionItem.key}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={item.key}>{item.name}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue>{field.value}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {optionItem.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>{item.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
