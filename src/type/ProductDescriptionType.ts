import { image } from "@nextui-org/react";
import { Schema } from "../../amplify/data/resource";
import { IBaseData, RegionArray } from "./IBaseData";
import { InputDefineType } from "./InputDefineType";
import { FileInput } from "lucide-react";
import { z } from "zod";
import { OptionInputDefineType } from "./OptionInputDefineType";
export class ProductDescriptionType implements IBaseData {
  id: string;

  description: string | null | undefined;
  imageKey: string | null | undefined;
  publish: boolean = true;

  constructor(
    id: string,
    description: string | null | undefined,
    imageKey: string | null | undefined
  ) {
    this.id = id;
    this.description = description;
    this.imageKey = "";
  }

  static createEmpty(): ProductDescriptionType {
    return new ProductDescriptionType("", "", "");
  }
  static fromProductDescription(
    productDescription: Schema["ProductDescription"]
  ): ProductDescriptionType {
    return new ProductDescriptionType(
      productDescription.id!,
      productDescription.description,
      productDescription.imageKey
    );
  }
  formStructure(): InputDefineType[] {
    return [
      new InputDefineType("description", "文字介绍", "text"),
      new InputDefineType("imageKey", "宣传图", "image"),
      new InputDefineType("publish", "是否发布", "switch"),
      new OptionInputDefineType("region", "地区", RegionArray),
    ];
  }
  formData() {
    return z.object({
      description: z.string().optional(),
      imageKey: z.instanceof(File, {
        message: "please select an image as Advertisement image",
      }),
      region: z.string(),
      publish: z.boolean().default(true),
    });
  }
}
