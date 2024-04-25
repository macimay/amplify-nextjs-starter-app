import { Schema } from "../../amplify/data/resource";

export default class AssetPackage {
  productId: string;
  capacity: number;
  usage: number;
  periodicStart: Date;
  periodicEnd: Date;
  region: string;
  unit: "TIMES" | "SECOND";

  constructor(
    productId: string,
    capacity: number,
    usage: number,
    periodicStart: Date,
    periodicEnd: Date,
    region: string,
    unit: "TIMES" | "SECOND"
  ) {
    this.productId = productId;
    this.capacity = capacity;
    this.usage = usage;
    this.periodicStart = periodicStart;
    this.periodicEnd = periodicEnd;
    this.region = region;
    this.unit = unit;
  }
  valid(): boolean {
    return this.capacity > this.usage;
  }
  static fromServerData(data: Schema["SubscriptionPool"]): AssetPackage {
    return new AssetPackage(
      data.pac,
      data.limit,
      data.periodic,
      data.region,
      data.unit,
      new Date(data.expire)
    );
  }
}
