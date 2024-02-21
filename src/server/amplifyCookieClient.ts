import { type Schema } from "@/../amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import amplifyConfig from "@/../amplifyconfiguration.json";
import { cookies } from "next/headers";

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: amplifyConfig,
  cookies,
});
