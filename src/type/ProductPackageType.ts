import { Schema } from "../../amplify/data/resource";
import { InputDefineType } from "./InputDefineType";
import { OptionInputDefineType } from "./OptionInputDefineType";
import {
  IBaseData,
  PeriodicArray,
  PeriodicType,
  RegionArray,
  RegionCode,
  UnitArray,
  UnitType,
} from "./IBaseData";
import { ZodAny, ZodArray, z } from "zod";
import { ValueWithOptionInputDefineType } from "./ValueWithOptionInputType";
import { validate } from "uuid";
import { ExpireDataType } from "./ExpireDataType";
import { ExpireInfoInputDefineType } from "./ExpireInfoInputDefineType";

export class ProductPackageType implements IBaseData {
  id: string;
  productId: string;
  name: string;

  count: number;
  unit: UnitType = "TIMES";
  period: PeriodicType = "DAY";
  region: RegionCode;

  expireInfo: ExpireDataType;

  constructor(
    id: string,
    productId: string,
    name: string,
    count: number,
    unit: UnitType = "TIMES",
    region: RegionCode = "CN",
    expireInfo: ExpireDataType = new ExpireDataType()
  ) {
    this.id = id;
    this.productId = productId;
    this.name = name;
    this.count = count;
    this.unit = unit;
    this.region = region;
    this.expireInfo = expireInfo;
  }
  static fromProductPackage(
    productPackage: Schema["ProductPackage"]
  ): ProductPackageType {
    return new ProductPackageType(
      productPackage.id!,
      productPackage.productPackagesId!,
      productPackage.name,
      productPackage.count,
      productPackage.unit
    );
  }
  static createEmpty(productId: string): ProductPackageType {
    return new ProductPackageType("", productId, "hello", 0, "TIMES");
  }
  formStructure(): InputDefineType[] {
    return [
      new InputDefineType("name", "名称", "text"),

      new ValueWithOptionInputDefineType(
        "count",
        "单位",
        "number",
        false,
        "unit",
        UnitArray,
        "数量单位，TIMES表示次数，SECOND表示秒数"
      ),
      new OptionInputDefineType("period", "周期", PeriodicArray),
      new InputDefineType("description", "描述", "text"),
      new OptionInputDefineType("region", "区域", RegionArray),
      new ExpireInfoInputDefineType(
        "expireInfo",
        "是否过期",
        this.expireInfo,
        "NEVER表示没有过期设置,ABSOLUTE表示设定绝对的生效以及过期时间，RELATIVE表示想对过期，即用户购买即生效,x天后过期"
      ),
    ];
  }
  formData(): any {
    return z.object({
      id: z.string().optional(),
      productId: z.string(),
      name: z.string().min(3),
      count: z.coerce.number().int().min(1),
      unit: z.enum(["TIMES", "SECOND"]),
      region: z.enum(RegionArray),
      expireInfo: this.expireInfo.validateInfo(),
    });
  }
}
