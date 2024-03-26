import { InputDefineType } from "./InputDefineType";
import { ExpireType } from "./IBaseData";
import { ZodObject, z } from "zod";

export class ExpireDataType {
  isExpire: ExpireType = "NEVER";
  availableAt?: string | null | undefined;
  expireAt?: string | null | undefined;
  expireInDays?: number | null | undefined;

  constructor(
    isExpire: ExpireType = "NEVER",
    availableAt: string | undefined | null = undefined,
    expireAt: string | undefined | null = undefined,
    expireInDays: number | undefined | null = undefined
  ) {
    this.isExpire = isExpire;
    this.availableAt = availableAt;
    this.expireAt = expireAt;
    this.expireInDays = expireInDays;
  }
  validateInfo(): any {
    return z
      .object({
        isExpire: z.enum(["NEVER", "RELATIVE", "ABSOLUTE"]),
        availableAt: z.string().optional(),
        expireAt: z.string().optional(),
        expireInDays: z.number().optional(),
      })
      .refine(
        (data) => {
          console.log("validate expireInfo:", data);
          if (data.isExpire === "RELATIVE") {
            console.log("relative:", data);
            return data.expireInDays! >= 0;
          }
          return true;
        },
        {
          message: "相对时间必须填写有效时间",
          path: ["expireInfo"],
        }
      )
      .refine(
        (data) => {
          if (data.isExpire === "ABSOLUTE") {
            console.log("validate absolute expireInfo:", data);
            const result =
              data.availableAt !== undefined &&
              data.expireAt !== undefined &&
              Date.parse(data.availableAt!) <= Date.parse(data.expireAt!);
            if (result) {
              console.log("absolute:", data);
              return true;
            } else {
              console.log("absolute failed:", data);
              return false;
            }
          }
          return true;
        },
        {
          message: "绝对时间必须填写有效时间",
          path: ["expireInfo"],
        }
      );
  }
}
