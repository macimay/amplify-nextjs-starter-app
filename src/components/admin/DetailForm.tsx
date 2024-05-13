"use client";
import { InputDefineType } from "@/type/InputDefineType";
import { ExpireArray, IBaseData } from "@/type/IBaseData";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Switch } from "../ui/switch";
import { useId, useState } from "react";
import S3Image from "../S3Image";
import { uploadData } from "aws-amplify/storage";
import { v4 as uuidv4 } from "uuid";
import { ValueWithOptionInputDefineType } from "@/type/ValueWithOptionInputType";
import { OptionInputDefineType } from "@/type/OptionInputDefineType";
import { ExpireInfoInputDefineType } from "@/type/ExpireInfoInputDefineType";
import DateFormField from "./DateFormField";
import TextFormField from "./TextFormField";
import OptionsFormField from "./OptionsFormField";
import ExpireFormField from "./ExpireFormField";
import UnitedValueFormField from "./UnitedValueFormField";
import FileFormField from "./FileFormField";
import SwitchFormField from "./SwitchFormField";
import { Description } from "@radix-ui/react-dialog";
import { LoadingButton } from "../ui/loadingButton";
import { useTranslations } from "next-intl";

export default function DetailForm({
  data,

  onSubmitCallback,
}: {
  data: IBaseData;
  onSubmitCallback: (values: z.infer<z.ZodObject<any, any>>) => void;
}) {
  if (!data) {
    return <></>;
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    data[event.target.name as keyof IBaseData] = event.target.value;
  };
  const formData = data.formData();

  const items = data.formStructure();

  const form = useForm<z.infer<typeof formData>>({
    resolver: zodResolver(formData),
    defaultValues: { ...data },
  });
  function onSubmit(values: z.infer<typeof formData>) {
    console.log("onSubmit:", values);
    // submit(values);
    setLoading(true);
    onSubmitCallback(values);
    setLoading(false);
  }
  const fileRef = form.register("file");
  console.log("DetailForm data:", data);
  const t = useTranslations("Base");
  const [loading, setLoading] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="form">
        {items.map((item: InputDefineType) => {
          if (!item) return;

          if (item?.type === "text") {
            return (
              <TextFormField
                type="text"
                key={item.key}
                control={form.control}
                item={item}
              />
            );
          } else if (item?.type === "number") {
            return (
              <TextFormField
                type="number"
                key={item.key}
                control={form.control}
                item={item}
              />
            );
          } else if (item.type === "switch") {
            return (
              <SwitchFormField
                key={item.key}
                control={form.control}
                item={item}
              />
            );
          } else if (item.type === "date") {
            const date =
              (data[item.key as keyof IBaseData] as Date) ?? new Date();

            return (
              <DateFormField
                date={date}
                key={item.key}
                control={form.control}
                item={item}
              />
            );
          } else if (item.type === "image") {
            return (
              <FileFormField
                key={item.key}
                s3ImageKey={data[item.key]}
                control={form.control}
                ref={form.register("file")}
                item={item}
              />
            );
          } else if (item.type === "unitedValue") {
            const unitedValueDefine = item as ValueWithOptionInputDefineType;
            return (
              <UnitedValueFormField
                key={item.key}
                control={form.control}
                item={item}
              />
            );
          } else if (item.type === "options") {
            const optionItem = item as OptionInputDefineType;
            return (
              <OptionsFormField
                key={item.key}
                control={form.control}
                item={item}
              />
            );
          } else if (item.type === "expireInfo") {
            const expireInfoItem = item as ExpireInfoInputDefineType;
            return (
              <ExpireFormField
                key={item.key}
                control={form.control}
                item={item}
              />
            );
          } else {
          }
        })}
        <LoadingButton type="submit" loading={loading}>
          {t("saveButton")}
        </LoadingButton>
      </form>
    </Form>
  );
}
