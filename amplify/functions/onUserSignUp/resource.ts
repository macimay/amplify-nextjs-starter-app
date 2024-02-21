import { defineFunction } from "@aws-amplify/backend";

export const afterSignUp = defineFunction({
  entry: "./handler.ts",
  environment: {
    tableName: "UserTable",
  },
  runtime: 20,
});
