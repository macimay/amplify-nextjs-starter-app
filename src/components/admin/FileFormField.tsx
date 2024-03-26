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
import { useState } from "react";
import S3Image from "../S3Image";

export default function FileFormField({
  s3ImageKey,
  control,
  item,
  ref,
  ...props
}: {
  s3ImageKey: string;
  control: Control<any, any>;
  item: InputDefineType;
  ref: any;
}) {
  const [imageKey, setImageKey] = useState<string | undefined>(undefined);

  return (
    <FormField
      {...props}
      name={item.key}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={item.key}>{item.name}</FormLabel>
          <div className="flex flex-row">
            {!imageKey && s3ImageKey && (
              <S3Image
                s3Key={s3ImageKey}
                className="w-24 h-24"
                key={item.key + "-s3Image"}
              />
            )}
            {!s3ImageKey ||
              (imageKey && (
                <img src={imageKey + "localImage"} width={240} height={240} />
              ))}
            <FormControl>
              <Input
                type="file"
                accept="image/png, image/jpeg"
                multiple={false}
                onChange={(e) => {
                  console.log("onSelect:", e.target.files);
                  if (e.target.files === null) return;
                  setImageKey(URL.createObjectURL(e.target.files[0]));
                  field.onChange(e.target?.files?.[0] ?? undefined);
                }}
                {...ref}
              />
            </FormControl>
          </div>
          <FormDescription>{item.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
