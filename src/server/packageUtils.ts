import { PenToolIcon } from "lucide-react";

export enum PoolResetPeriodicity {
  NEVER = "never",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}
export type PoolInfo = {
  amount: number;
  start: Date;
  end?: Date;
  periodicity?: PoolResetPeriodicity;
};
export async function getProductUsageByPackage(
  packageInfo: any,
  start: Date
): Promise<PoolInfo> {
  return {
    amount: 100,
    start: new Date(),
    periodicity: PoolResetPeriodicity.NEVER,
  };
}
