import { z } from "zod";
import { IBaseData, MemberStatusArray } from "./IBaseData";
import { InputDefineType } from "./InputDefineType";
import { Schema } from "../../amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";
import { OptionInputDefineType } from "./OptionInputDefineType";

export const teamMemberType = [
  "id",
  "alias",
  "alias",
  "user.id",
  "user.username",
  "user.avatar",
  "status",
] as const;
export type TeamMemberSourceType = SelectionSet<
  Schema["TeamMember"],
  typeof teamMemberType
>;

export class TeamMemberType implements IBaseData {
  id: string;
  alias: string;
  title: string;
  status: boolean;

  constructor(id: string, alias: string, title: string, status: boolean) {
    this.id = id;
    this.alias = alias;
    this.title = title;
    this.status = status;
  }
  static fromMember(member: any): TeamMemberType {
    return new TeamMemberType(
      member.id!,
      member.alias,
      member.title,
      member.status
    );
  }
  formStructure(): InputDefineType[] {
    return [
      new InputDefineType("id", "ID", "hidden"),
      new InputDefineType("alias", "别名", "text"),
      new InputDefineType("title", "职位", "text"),
      new OptionInputDefineType("status", "状态", MemberStatusArray),
    ];
  }
  formData(): any {
    return z.object({
      id: z.string(),
      alias: z.string(),
      title: z.string(),
      status: z.string(),
    });
  }
}
