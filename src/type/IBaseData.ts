import { z } from "zod";
import { InputDefineType } from "./InputDefineType";
import { Input } from "postcss";

export type CurrencyCode = "USD" | "CNY" | "EUR" | "JPY" | "GBP";
export const CurrentArray = ["USD", "CNY", "EUR", "JPY", "GBP"] as const;

export type RegionCode = "CN" | "US" | "JP" | "EU" | "UK";
export const RegionArray = ["CN", "US", "JP", "EU", "UK"] as const;

export type ExpireType = "NEVER" | "RELATIVE" | "ABSOLUTE";
export const ExpireArray = ["NEVER", "RELATIVE", "ABSOLUTE"] as const;

export type PeriodicType = "DAY" | "WEEK" | "MONTH" | "YEAR";
export const PeriodicArray = ["DAY", "WEEK", "MONTH", "YEAR"] as const;

export type UnitType = "TIMES" | "SECOND";
export const UnitArray = ["TIMES", "SECOND"] as const;
export const MemberStatusArray = [
  "ACTIVE",
  "PENDING",
  "SUSPEND",
  "CLOSED",
] as const;
export interface IBaseData {
  id: string;
  [key: string]: any;
  formStructure(): InputDefineType[];
  formData(): any;
}
