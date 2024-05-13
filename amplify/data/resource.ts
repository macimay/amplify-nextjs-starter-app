import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { profile } from "console";
import { subscribe } from "diagnostics_channel";
import { getPriority } from "os";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rules below
specify that owners, authenticated via your Auth resource can "create",
"read", "update", and "delete" their own records. Public users,
authenticated via an API key, can only "read" records.
=========================================================================*/
const schema = a.schema({
  TeamType: a.enum(["TEAM", "PERSONAL"]),
  Status: a.enum(["ACTIVE", "PENDING", "SUSPEND", "CLOSED"]),
  UserRole: a.enum(["ADMIN", "MEMBER"]),
  Periodic: a.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
  PackageUnit: a.enum(["TIMES", "SECOND"]),
  ExpireType: a.enum(["NEVER", "RELATIVE", "ABSOLUTE"]),
  PriceCurrency: a.enum(["CNY", "USD", "EUR", "JPY", "GBP"]),
  SubscriptionRegion: a.enum(["GLOBAL", "CN", "US", "EU", "JP", "UK"]),

  User: a
    .model({
      id: a.id(),
      username: a.string().required(),
      accountId: a.string().required(),
      avatar: a.string(),
      email: a.email(),
      phone: a.phone(),
      status: a.ref("Status").required(),
      teamMember: a.hasMany("TeamMember", "userId"),
    })
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),

  Team: a
    .model({
      name: a.string().required(),
      icon: a.string(),
      adminId: a.id().required(),
      level: a.integer().default(0).required(),
      region: a.ref("SubscriptionRegion").required(),
      inviteCode: a.hasOne("InviteCode", "teamId"),
      members: a.hasMany("TeamMember", "teamId"),
      pool: a.hasMany("SubscriptionPool", "teamId"),
      subscriptions: a.hasMany("TeamSubscriptions", "teamId"),
    })
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),

  TeamMember: a
    .model({
      teamId: a.id().required(),
      team: a.belongsTo("Team", "teamId"),
      userId: a.id().required(),
      user: a.belongsTo("User", "userId"),
      alias: a.string(),
      title: a.string(),
      role: a.ref("UserRole").required(),
      joinAt: a.datetime().required(),
      status: a.ref("Status"),
      session: a.belongsTo("UserSession", "id"),
    })
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),

  InviteCode: a
    .model({
      teamId: a.id().required(),
      team: a.belongsTo("Team", "teamId"),
      code: a.string().required(),

      used: a.boolean().default(false),
      createAt: a.datetime().required(),
      expiredAt: a.datetime(),
    })
    .identifier(["teamId"])
    .secondaryIndexes((index) => [index("code").queryField("listInviteCode")])
    .authorization((allow) => [allow.publicApiKey()]),

  UserSession: a
    .model({
      userId: a.id().required(),
      teamMemberId: a.id(),
      teamMember: a.hasOne("TeamMember", "id"),
      createAt: a.datetime().required(),
      updateAt: a.datetime().required(),

      ip: a.string().required(),
    })
    .identifier(["userId"])
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),
  Product: a
    .model({
      name: a.string().required(),
      shortName: a.string().required(),
      icon: a.string().required(),
      description: a.hasMany("ProductDescription", "productId"),
      publish: a.boolean().default(true).required(),
      packages: a.hasMany("ProductPackage", "productId"),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),

  ProductDescription: a
    .model({
      productId: a.id().required(),
      product: a.belongsTo("Product", "productId"),
      imageKey: a.string(),

      description: a.string(),
      publish: a.boolean().default(false).required(),
      order: a.integer().required(),
      region: a.ref("SubscriptionRegion").required(),
      createdAt: a.datetime(),
    })
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),

  SubscriptionPool: a
    .model({
      teamId: a.id(),
      team: a.belongsTo("Team", "teamId"),

      subscriptionId: a.id().required(),

      packageId: a.id().required(),
      package: a.belongsTo("ProductPackage", "packageId"),

      used: a.integer().required(),
      periodicStart: a.datetime().required(),
      periodicEnd: a.datetime(),
      capacity: a.integer().required(),
      priority: a.integer().required(),
      status: a.ref("Status").required(),
      startAt: a.datetime(),
      expireAt: a.datetime(),
      updateAt: a.datetime(),
    })
    .secondaryIndexes((index) => [index("teamId"), index("subscriptionId")])
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),

  subscriptionPoolHistory: a
    .model({
      teamId: a.string().required(),

      packageId: a.string().required(),
      used: a.integer().required(),
      periodicStart: a.datetime(),
      periodicEnd: a.datetime(),
      capacity: a.integer().required(),
    })
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),

  Subscriptions: a
    .model({
      name: a.string().required(),

      packages: a.hasMany("ProductPackage", "subscriptionId"),

      price: a.float().required(),
      currency: a.ref("PriceCurrency").required(),
      period: a.ref("Periodic").required(),
      capacity: a.integer().required(),

      amount: a.integer().required(),
      description: a.string().required(),
      region: a.ref("SubscriptionRegion").required(),
      level: a.integer().required(),
      isExpired: a.ref("ExpireType").required(),
      isTrial: a.boolean().default(false),
      priority: a.integer().required(),

      availableAt: a.date(),
      expireAt: a.date(),
      expireInDays: a.integer(),
      publish: a.boolean().default(true).required(),
    })
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),

  TeamSubscriptions: a
    .model({
      teamId: a.id().required(),
      team: a.belongsTo("Team", "teamId"),
      subscriptionId: a.id().required(),
      availableAt: a.datetime().required(),
      expireAt: a.datetime().required(),
      priority: a.integer().required(),
    })
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),

  ProductPackage: a
    .model({
      productId: a.id().required(),
      product: a.belongsTo("Product", "productId"),
      subscriptionId: a.id(),
      subscription: a.belongsTo("Subscriptions", "subscriptionId"),
      packages: a.hasMany("SubscriptionPool", "packageId"),
      name: a.string().required(),
      count: a.integer().required(),
      unit: a.ref("PackageUnit").required(),
      description: a.string(),

      region: a.ref("SubscriptionRegion").required(),
      isExpire: a.ref("ExpireType").required(),
      availableAt: a.date(),
      expireAt: a.date(),
      expireInDays: a.integer(),

      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),

  SubscriptionOrder: a
    .model({
      teamId: a.id().required(),

      subscriptionId: a.id().required(),
      price: a.float().required(),
      currency: a.ref("PriceCurrency").required(),
      count: a.integer().required(),
      amount: a.float().required(),
      createAt: a.datetime().required(),
    })
    .authorization((allow) =>
      allow.publicApiKey().to(["read", "create", "delete", "update"])
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },

    // IAM is used for a.allow.owner() rules
  },
  functions: {
    // define a function that can be used in your schema
    // @see https://docs.amplify.aws/gen2/build-a-backend/function
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
