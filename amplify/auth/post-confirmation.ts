import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { default as fetch, Request } from "node-fetch";
import { HttpRequest } from "@aws-sdk/protocol-http";
import * as CommonGraph from "../functions/common/graphQLFuncs.js";

(global as any).fetch = fetch;

var userCounter = 0;
export const handler: PostConfirmationTriggerHandler = async (event) => {
  // your code here

  console.log("PostAuthenticationTriggerHandler");
  console.log("Received event {}", JSON.stringify(event));

  let userName: string = "画神_" + Math.floor(Math.random() * 10000) + 1;
  const userVariables = {
    input: {
      username: userName,
      cognitoId: event.request.userAttributes.sub,
    },
  };
  //   const teamVariables = {
  //     input: {
  //       name: userName + " 的创作空间",
  //       type:"PERSONAL",
  //       admin:

  //     },
  //   };
  console.log("user_variables", JSON.stringify(userVariables));

  await CommonGraph.postGraphql(CommonGraph.createUserQL, userVariables);

  return event;
};
