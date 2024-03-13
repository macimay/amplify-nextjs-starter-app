import { z } from "zod";
import { FormDefineType } from "./FormDefineType";

export interface IBaseData {
  id: string;
  [key: string]: any;
  formStructure(key: string): FormDefineType | undefined;
  formData(): z.ZodObject<any, any>;
}
