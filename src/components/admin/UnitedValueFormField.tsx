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
import { ValueWithOptionInputDefineType } from "@/type/ValueWithOptionInputType";

export default function UnitedValueFormField({
  control,
  item,
  ...props
}: {
  control: Control<any, any>;
  item: InputDefineType;
}) {
  const optionItem = item as ValueWithOptionInputDefineType;
  return (
    <div className="flex flex-row items-end" key={item.key + "unitedValue"}>
      <FormField
        {...props}
        name={optionItem.key}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={item.key}>{item.name}</FormLabel>
            <FormControl>
              <Input type={optionItem.inputType} {...field} />
            </FormControl>
            <FormDescription>description</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={optionItem.optionKey}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择">{field.value}</SelectValue>
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
    </div>
  );
}
