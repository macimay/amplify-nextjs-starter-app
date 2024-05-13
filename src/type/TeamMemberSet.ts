import { SelectionSet } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";

const selectionSet = [
  "teamMember.alias",
  "teamMember.user.*",
  "teamMember.role",
  "teamMember.team.*",
] as const;
export type SessionWithMember = SelectionSet<
  Schema["UserSession"],
  typeof selectionSet
>;
