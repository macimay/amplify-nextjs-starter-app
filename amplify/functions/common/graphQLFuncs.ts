export * from "./userQLFuncs.js";
import { default as fetch, Request } from "node-fetch";

(global as any).fetch = fetch;

export const GRAPHQL_ENDPOINT: string = process.env.endPoint!;

export const GRAPHQL_X_KEY: string = process.env.key!;

export async function postGraphql(query: string, variables: {}) {
  const userOptions = {
    method: "POST",
    headers: {
      "x-api-key": GRAPHQL_X_KEY,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      query: query,

      variables,
    }),
  };

  const endpoint = new URL(GRAPHQL_ENDPOINT);
  const request = new Request(
    endpoint,

    userOptions
  );
  let statusCode = 200;
  let body: any;
  let response: any;

  try {
    console.log("request", JSON.stringify(request));
    response = await fetch(request);
    body = await response.json();
    console.log("response", JSON.stringify(response));
  } catch (error: any) {
    console.log("error", JSON.stringify(error));
  }
}
