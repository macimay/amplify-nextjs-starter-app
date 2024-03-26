import { InputDefineType } from "@/type/InputDefineType";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Control } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { date } from "zod";
import { Calendar } from "../ui/calendar";

export default function DateFormField({
  date,
  control,
  item,
  ...props
}: {
  date?: Date;
  control: Control<any, any>;
  item: InputDefineType;
}) {
  return (
    <FormField
      {...props}
      name={item.name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={item.key}>{item.name}</FormLabel>
          <FormControl>
            <div className="flex flex-row">
              <Input {...field} readOnly />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormControl>
          <FormDescription>{item.description}</FormDescription>
        </FormItem>
      )}
    />
  );
}
