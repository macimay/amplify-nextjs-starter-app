export class FormDefineType {
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
    | "button";

  optional: boolean;
  constructor(key: string, name: string, type: string, optional: boolean) {
    this.key = key;
    this.name = name;
    this.type = type as this["type"];
    this.optional = optional;
  }
}
