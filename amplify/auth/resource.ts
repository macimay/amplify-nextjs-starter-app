import { defineAuth } from "@aws-amplify/backend";
import { defineFunction } from "@aws-amplify/backend-function";

/**
 * Define and configure your auth resource
 * When used alongside data, it is automatically configured as an auth provider for data
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
// let GRAPHQL_ENDPOINT =
//   "https://uuhqf4vk3bhvtoxq46glqcfica.appsync-api.ap-northeast-2.amazonaws.com/graphql";
// let GRAPHQL_X_KEY = "da2-3ny3m2tjhrbkzokgsxohuxxubq";
export const auth = defineAuth({
  loginWith: {
    email: true,
    // add social providers
    // externalProviders: {
    //   /**
    //    * first, create your secrets using `amplify sandbox secret`
    //    * then, import `secret` from `@aws-amplify/backend`
    //    * @see https://docs.amplify.aws/gen2/deploy-and-host/sandbox-environments/features/#setting-secrets
    //    */
    //   // loginWithAmazon: {
    //   //   clientId: secret('LOGINWITHAMAZON_CLIENT_ID'),
    //   //   clientSecret: secret('LOGINWITHAMAZON_CLIENT_SECRET'),
    //   // }
    // },
  },
  /**
   * enable multifactor authentication
   * @see https://docs.amplify.aws/gen2/build-a-backend/auth/manage-mfa
   */
  // multifactor: {
  //   mode: 'OPTIONAL',
  //   sms: {
  //     smsMessage: (code) => `Your verification code is ${code}`,
  //   },
  // },
  userAttributes: {
    /** request additional attributes for your app's users */
    preferredUsername: {
      required: true,
    },

    // profilePicture: {
    //   mutable: true,
    //   required: false,
    // },
  },
  triggers: {
    // postAuthentication: defineFunction({
    //   name: "postAuthentication",
    //   entry: "post-authentication.ts",
    //   environment: {
    //     endPoint: GRAPHQL_ENDPOINT,
    //     key: GRAPHQL_X_KEY,
    //   },
    // }),
    // postConfirmation: defineFunction({
    //   name: "postConfirmation",
    //   entry: "post-confirmation.ts",
    //   environment: {
    //     endPoint: GRAPHQL_ENDPOINT,
    //     key: GRAPHQL_X_KEY,
    //   },
    // }),
    /** add pre-sign-up lambda trigger */
    // function: defineFunction('preSignUp', 'src/preSignUp.js'),
    // function: defineFunction('preSignUp', 'src/preSignUp.ts'),
  },
});
