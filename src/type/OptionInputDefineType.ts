import { InputDefineType } from "./InputDefineType";
export class OptionInputDefineType extends InputDefineType {
  options: readonly string[];

  constructor(
    key: string,
    name: string,

    options: readonly string[],
    description: string = ""
  ) {
    super(key, name, "options", description);
    this.options = options;
  }
}
