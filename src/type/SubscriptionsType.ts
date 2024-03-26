import { Schema } from "../../amplify/data/resource";
import { InputDefineType } from "./InputDefineType";
import { OptionInputDefineType } from "./OptionInputDefineType";
import {
  CurrencyCode,
  CurrentArray,
  ExpireArray,
  ExpireType,
  IBaseData,
  PeriodicArray,
  RegionArray,
} from "./IBaseData";
import { ZodAny, ZodArray, z } from "zod";
import { ValueWithOptionInputDefineType } from "./ValueWithOptionInputType";
import { validate } from "uuid";
import { ExpireDataType } from "./ExpireDataType";
import { ExpireInfoInputDefineType } from "./ExpireInfoInputDefineType";

export class SubscriptionsType implements IBaseData {
  id: string;
  name: string;
  price: number;
  currency: CurrencyCode;
  capacity: number;
  period: string;
  level: number;
  amount: number;
  description?: string | undefined;
  region: string;
  publish: boolean = true;
  expireInfo: ExpireDataType;

  constructor(
    id: string,
    name: string,
    price: number,
    currency: CurrencyCode,
    capacity: number,
    period: string,
    level: number,
    amount: number,
    description: string,
    region: string,
    expireInfo: ExpireDataType,
    publish: boolean = true
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.currency = currency;
    this.description = description;
    this.region = region;
    this.expireInfo = expireInfo;
    this.publish = publish;
    this.period = period;
    this.capacity = capacity;
    this.level = level;
    this.amount = amount;
  }

  static fromSubscriptions(
    subscriptions: Schema["Subscriptions"]
  ): SubscriptionsType {
    return new SubscriptionsType(
      subscriptions.id!,
      subscriptions.name,
      subscriptions.price,
      subscriptions.currency,
      subscriptions.capacity,
      subscriptions.period,
      subscriptions.level,
      subscriptions.amount,
      subscriptions.description,
      subscriptions.region,
      new ExpireDataType(
        subscriptions.isExpired,
        subscriptions.availableAt,
        subscriptions.expireAt,
        subscriptions.expireInDays
      ),
      subscriptions.publish
    );
  }
  static createEmpty(): SubscriptionsType {
    return new SubscriptionsType(
      "",
      "",
      0,
      "USD",
      0,
      "",
      0,
      0,
      "",
      "CN",
      new ExpireDataType("ABSOLUTE", "04/24/2024", undefined, undefined),
      true
    );
  }
  formData(): any {
    return z
      .object({
        id: z.string().optional(),
        name: z.string().min(2),
        price: z.coerce.number(),
        currency: z.string(),
        level: z.coerce.number().min(1),
        period: z.string(),
        capacity: z.coerce.number(),
        region: z.string(),
        amount: z.coerce.number(),
        description: z.string(),
        expireInfo: new ExpireDataType().validateInfo(),
        publish: z.boolean().default(true),
      })
      .partial();
  }
  formStructure(): InputDefineType[] {
    return [
      new InputDefineType("id", "ID", "hidden"),
      new InputDefineType("name", "名称", "text"),
      new ValueWithOptionInputDefineType(
        "price",
        "价格",
        "number",
        false,
        "currency",
        CurrentArray
      ),
      new OptionInputDefineType("period", "计费周期", PeriodicArray),
      new InputDefineType("level", "购买所需等级", "number"),

      new InputDefineType("capacity", "支持人数", "number"),
      new InputDefineType("amount", "总额", "number"),
      new OptionInputDefineType("region", "区域", RegionArray),
      new InputDefineType("description", "描述", "textarea"),
      new ExpireInfoInputDefineType("expireInfo", "过期类型", this.expireInfo),
      new InputDefineType("publish", "发布", "switch"),
    ];
  }
}
