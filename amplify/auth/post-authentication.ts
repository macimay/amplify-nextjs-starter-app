import type { PostAuthenticationTriggerHandler } from "aws-lambda";
import { default as fetch, Request } from "node-fetch";
import { HttpRequest } from "@aws-sdk/protocol-http";

(global as any).fetch = fetch;

const query = /* GraphQL */ `
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      cognitoId
      username
      createdAt
    }
  }
`;

var userCounter = 0;
export const handler: PostAuthenticationTriggerHandler = async (event) => {
  // your code here

  console.log("PostAuthenticationTriggerHandler");
  console.log("Received event {}", JSON.stringify(event));

  const variables = {
    input: {
      username: "NewUser_" + userCounter++,
      cognitoId: event.request.userAttributes.sub,
    },
  };
  console.log("variables", JSON.stringify(variables));

  const options = {
    method: "POST",
    headers: {
      "x-api-key": "da2-3ny3m2tjhrbkzokgsxohuxxubq",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      query: query,

      variables,
    }),
  };
  const endpoint = new URL(
    "https://uuhqf4vk3bhvtoxq46glqcfica.appsync-api.ap-northeast-2.amazonaws.com/graphql"
  );
  const request = new Request(
    endpoint,

    options
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

  return event;
};
