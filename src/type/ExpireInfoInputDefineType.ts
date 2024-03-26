import { ExpireDataType } from "./ExpireDataType";
import { InputDefineType } from "./InputDefineType";

export class ExpireInfoInputDefineType extends InputDefineType {
  expireInfo: ExpireDataType;
  constructor(
    key: string,
    name: string,
    info: ExpireDataType,
    description: string = ""
  ) {
    super(key, name, "expireInfo", description);
    this.expireInfo = info;
  }
}
