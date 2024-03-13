import { Schema } from "../../amplify/data/resource";
import { FormDefineType } from "./FormDefineType";
import { IBaseData } from "./IBaseData";
import { z } from "zod";

export class ProductPackageType implements IBaseData {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  isExpired: "NEVER" | "RELATIVE" | "ABSOLUTE";

  availableAt?: string | undefined;
  expireAt?: string | undefined;
  expireInDays?: number | undefined;

  constructor(
    id: string,
    name: string,
    price: number,
    currency: string,
    description: string,
    isExpired: "NEVER" | "RELATIVE" | "ABSOLUTE",
    availableAt?: string | undefined,
    expireAt?: string | undefined,
    expireInDays?: number | undefined
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.currency = currency;
    this.description = description;
    this.isExpired = isExpired;
    this.availableAt = availableAt; // Assign a default value if availableAt is undefined
    this.expireAt = expireAt;
    this.expireInDays = expireInDays;
  }
  static fromProductPackage(
    productPackage: Schema["ProductPackage"]
  ): ProductPackageType {
    return new ProductPackageType(
      productPackage.id!,
      productPackage.name,
      productPackage.price,
      productPackage.currency,
      productPackage.description ?? "",
      productPackage.isExpired,
      productPackage.availableAt ?? undefined,
      productPackage.expireAt ?? undefined,
      productPackage.expireInDays ?? undefined
    );
  }
  static createEmpty(): ProductPackageType {
    return new ProductPackageType(
      "",
      "",
      0,
      "",
      "",
      "NEVER",
      undefined,
      undefined,
      undefined
    );
  }
  formStructure(key: string): FormDefineType | undefined {
    switch (key) {
      case "name":
        return new FormDefineType(key, "名称", "hidden", false);
      case "price":
        return new FormDefineType(key, "价格", "number", false);
      case "currency":
        return new FormDefineType(key, "货币", "text", false);
      case "description":
        return new FormDefineType(key, "描述", "text", false);
      case "isExpired":
        return new FormDefineType(key, "是否过期", "boolean", false);
      case "expireAt":
        return new FormDefineType(key, "绝对过期时间", "date", true);
      case "availableAt":
        return new FormDefineType(key, "启用时间", "date", true);
      case "expireInDays":
        return new FormDefineType(key, "有效时间", "number", true);
    }
    return undefined;
  }
  formData(): z.ZodObject<any, any> {
    return z.object({
      id: z.string().optional(),
      name: z.string(),
      price: z.number(),
      currency: z.string(),
      description: z.string().optional(),
      isExpired: z.enum(["NEVER", "RELATIVE", "ABSOLUTE"]),
      expireAt: z.date().optional(),
      availableAt: z.date().optional(),
      expireInDays: z.number().optional(),
    });
  }
}
