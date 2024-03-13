import { Schema } from "@/../amplify/data/resource";
import { FormDefineType } from "./FormDefineType";
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
  formData(): z.ZodObject<any, any> {
    return z.object({
      id: z.string().optional(),
      name: z.string(),
      shortName: z.string(),
      icon: z.instanceof(File, { message: "please select as image as icon" }),

      publish: z.boolean().default(true),
    });
  }
  formStructure(key: string): FormDefineType | undefined {
    switch (key) {
      case "id":
        return new FormDefineType("id", "ID", "hidden", true);
      case "name":
        return new FormDefineType("name", "产品名称", "text", true);
      case "shortName":
        return new FormDefineType(
          "shortName",
          "简称(英文，不能有空格)",
          "text",
          true
        );
      case "icon":
        return new FormDefineType("icon", "图标", "image", true);
      case "publish":
        return new FormDefineType("publish", "是否发布", "switch", true);
      default:
        return undefined;
    }
  }
}
