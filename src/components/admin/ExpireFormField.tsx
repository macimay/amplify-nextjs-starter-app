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
import { ExpireInfoInputDefineType } from "@/type/ExpireInfoInputDefineType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ExpireArray } from "@/type/IBaseData";
import DateFormField from "./DateFormField";

export default function ExpireFormField({
  control,
  item,
  ...props
}: {
  control: Control<any, any>;
  item: InputDefineType;
}) {
  const expireItem = item as ExpireInfoInputDefineType;
  console.log("expireInfo:", expireItem);
  return (
    <FormField
      {...props}
      name={item.key}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={item.key}>{item.name}</FormLabel>
          <FormControl>
            <div>
              <Select
                onValueChange={(e) => {
                  console.log("onValueChange", field);
                  field.onChange({ isExpire: e });
                }}
                defaultValue={field.value.isExpire}
              >
                <SelectTrigger>
                  <SelectValue>{field.value.isExpire}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ExpireArray.map((expireType) => (
                    <SelectItem key={expireType} value={expireType}>
                      {expireType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.value.isExpire === "ABSOLUTE" && (
                <div className="flex flex-col ">
                  <div className="flex flex-row">
                    <p>起始时间</p>
                    <p className="w-64 text-right">{field.value.availableAt}</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[64px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value.availableAt}
                          onSelect={(date) => {
                            field.onChange({
                              ...field.value,
                              availableAt: date?.toLocaleDateString(),
                            });
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-row justify-start">
                    <p>结束时间</p>
                    <p className="w-64 text-right">{field.value.expireAt}</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[64px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value.expireAt}
                          onSelect={(date) => {
                            field.onChange({
                              ...field.value,
                              expireAt: date?.toLocaleDateString(),
                            });
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
              {field.value.isExpire === "RELATIVE" && (
                <div className="flex flex-row">
                  <p className="w-32">有效天数</p>
                  <Input
                    type="number"
                    onChange={(e) => {
                      field.onChange({
                        ...field.value,
                        expireInDays: Number.parseInt(e.target.value),
                      });
                      console.log("expireInDays", field);
                    }}
                  />
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>{expireItem.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
