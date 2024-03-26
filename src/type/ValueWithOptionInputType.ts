import { InputDefineType } from "./InputDefineType";
export class ValueWithOptionInputDefineType extends InputDefineType {
  optionKey: string;
  inputType: string;
  options: readonly string[];

  constructor(
    key: string,
    name: string,
    type: string,
    optional: boolean,
    optionKey: string,
    options: readonly string[],
    description: string = ""
  ) {
    super(key, name, "unitedValue", description);
    this.optionKey = optionKey;
    this.options = options;
    this.inputType = type;
  }
}
