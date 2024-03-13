import { FormDefineType } from "@/type/FormDefineType";
import { IBaseData } from "@/type/IBaseData";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FormInput } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@aws-amplify/ui-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "../ui/switch";
import { useId, useState } from "react";
import S3Image from "../S3Image";
import { uploadData } from "aws-amplify/storage";
import { v4 as uuidv4 } from "uuid";

export default function DetailForm({
  data,

  submit,
}: {
  data: IBaseData;
  submit: (values: z.infer<z.ZodObject<any, any>>) => void;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    data[event.target.name as keyof IBaseData] = event.target.value;
  };
  const formData = data.formData();

  const form = useForm<z.infer<typeof formData>>({
    resolver: zodResolver(formData),
    defaultValues: { ...data },
  });
  function onSubmit(values: z.infer<typeof formData>) {
    console.log("onSubmit:", values);
    submit(values);
  }
  const fileRef = form.register("file");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {Object.keys(data).map((key) => {
          const item = data.formStructure(key);
          if (!item) return <></>;
          if (item?.type === "text") {
            return (
              <FormField
                key={item.key}
                name={item.key}
                control={form.control}
                //   control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={item.key}>{item.name}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>description</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          } else if (item.type === "switch") {
            return (
              <FormField
                key={item.key}
                name={item.key}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={item.key}>{item.name}</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>description</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          } else if (item.type === "date") {
            const date = (data[key as keyof IBaseData] as Date) ?? new Date();
            const dateString = data[key as keyof IBaseData]
              ? format(date, "PPP")
              : date.toDateString();
            return (
              <FormField
                key={item.key}
                name={item.name}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={item.key}>{item.name}</FormLabel>
                    <FormControl>
                      <div className="flex flex-row" key={item.key}>
                        <Input {...field} defaultValue={dateString} />
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
                            <Calendar mode="single" selected={date} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FormControl>
                    <FormDescription></FormDescription>
                  </FormItem>
                )}
              ></FormField>
            );
          } else if (item.type === "image") {
            const [imageKey, setImageKey] = useState<string | undefined>(
              undefined
            );
            const fileRef = form.register("file");

            return (
              <FormField
                key={item.key}
                name={item.key}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={item.key}>{item.name}</FormLabel>
                    <div className="flex flex-row">
                      {/* <S3Image key={imageKey} width={240} height={240} /> */}
                      <img src={imageKey} width={240} height={240} />
                      <FormControl>
                        <Input
                          // {...field}
                          type="file"
                          accept="image/png, image/jpeg"
                          multiple={false}
                          onChange={(e) => {
                            console.log("onSelect:", e.target.files);
                            if (e.target.files === null) return;
                            setImageKey(URL.createObjectURL(e.target.files[0]));
                            field.onChange(e.target?.files?.[0] ?? undefined);
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>description</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }
        })}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
