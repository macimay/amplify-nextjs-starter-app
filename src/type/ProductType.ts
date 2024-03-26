import { Schema } from "@/../amplify/data/resource";
import { InputDefineType } from "./InputDefineType";
import { IBaseData } from "./IBaseData";
import { z } from "zod";

export class ProductType implements IBaseData {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  publish: boolean = true;
  constructor(
    id: string,
    name: string,
    shortName: string,
    icon: string,
    publish: boolean = true
  ) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
    this.icon = icon;
    this.publish = publish;
  }

  static fromProduct(product: Schema["Product"]): ProductType {
    return new ProductType(
      product.id!,
      product.name,
      product.shortName,
      product.icon!,
      product.publish
    );
  }
  static createEmpty(): ProductType {
    return new ProductType("", "", "", "");
  }
  formData(): any {
    return z.object({
      id: z.string().optional(),
      name: z.string(),
      shortName: z.string(),
      icon: z.instanceof(File, {
        message: "please select an image as icon",
      }),

      publish: z.boolean().default(true),
    });
  }
  formStructure(): InputDefineType[] {
    return [
      new InputDefineType("id", "ID", "hidden"),
      new InputDefineType("name", "产品名称", "text"),
      new InputDefineType("shortName", "简称(英文，不能有空格)", "text"),
      new InputDefineType("icon", "图标", "image"),
      new InputDefineType("publish", "是否发布", "switch"),
    ];
  }
}
