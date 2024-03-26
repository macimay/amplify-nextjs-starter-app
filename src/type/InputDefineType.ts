export class InputDefineType {
  key: string;
  name: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "url"
    | "tel"
    | "search"
    | "color"
    | "file"
    | "hidden"
    | "image"
    | "range"
    | "reset"
    | "submit"
    | "switch"
    | "unitedValue"
    | "options"
    | "textarea"
    | "expireInfo"
    | "button";
  description: string;

  constructor(
    key: string,
    name: string,
    type: string,
    description: string = ""
  ) {
    this.key = key;
    this.name = name;
    this.type = type as this["type"];
    this.description = description;
  }
}
