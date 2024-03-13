import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "myProjectFiles",
  access: (allow) => ({
    "/public/image/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
    "/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});
