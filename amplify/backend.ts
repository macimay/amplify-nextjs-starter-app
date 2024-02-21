import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { afterSignUp } from "./functions/onUserSignUp/resource.js";

defineBackend({
  auth,
  data,
  afterSignUp,
});
