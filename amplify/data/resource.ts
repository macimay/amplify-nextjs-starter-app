import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

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
    })
    .authorization([
      a.allow.public().to(["read", "create", "delete", "update"]),
    ]),

  Team: a
    .model({
      name: a.string().required(),
      icon: a.string(),
      admin: a.hasOne("User").required(),
      level: a.integer().default(0).required(),
      region: a.ref("SubscriptionRegion").required(),
    })
    .authorization([
      a.allow.public().to(["read", "create", "delete", "update"]),
    ]),

  TeamMember: a
    .model({
      team: a.hasOne("Team").required(),
      user: a.hasOne("User").required(),
      alias: a.string(),
      title: a.string(),
      role: a.ref("UserRole").required(),
      joinAt: a.datetime().required(),
      status: a.ref("Status").required(),
    })
    .authorization([
      a.allow.public().to(["read", "create", "delete", "update"]),
    ]),

  InviteCode: a
    .model({
      code: a.string().required(),
      team: a.hasOne("Team").required(),
      used: a.boolean().default(false),
      createAt: a.datetime().required(),
      expiredAt: a.datetime(),
    })
    .authorization([
      a.allow.public().to(["read", "create", "delete", "update"]),
    ]),

  UserSession: a
    .model({
      userId: a.id().required(),
      relation: a.hasOne("TeamMember"),
      createAt: a.datetime().required(),
      updateAt: a.datetime().required(),

      ip: a.string().required(),
    })
    .identifier(["userId"])
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  Product: a
    .model({
      name: a.string().required(),
      shortName: a.string().required(),
      icon: a.string().required(),
      description: a.hasMany("ProductDescription"),
      publish: a.boolean().default(true).required(),
      packages: a.hasMany("ProductPackage"),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  ProductDescription: a
    .model({
      imageKey: a.string(),
      description: a.string(),
      publish: a.boolean().default(false).required(),
      order: a.integer().required(),
      region: a.ref("SubscriptionRegion").required(),
      createdAt: a.datetime(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  ProductPool: a
    .model({
      teamId: a.string().required(),
      package: a.hasOne("ProductPackage").required(),
      count: a.integer().required(),
      // usage: a.hasMany("ProductUsage"),

      unit: a.ref("PackageUnit").required(),
      period: a.ref("Periodic").required(),
      used: a.integer().required(),
      priority: a.integer().required(),
      status: a.ref("Status").required(),
      startAt: a.datetime(),
      expireAt: a.datetime(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  ProductUsage: a
    .model({
      teamId: a.string().required(),
      // pool: a.belongsTo("ProductPool"),
      used: a.integer().required(),
      lastUpdateAt: a.datetime(),
      StartAt: a.datetime(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  Subscriptions: a
    .model({
      name: a.string().required(),
      packages: a.manyToMany("ProductPackage", {
        relationName: "ProductPackageSubscriptions",
      }),
      price: a.float().required(),
      currency: a.ref("PriceCurrency").required(),
      period: a.ref("Periodic").required(),
      capacity: a.integer().required(),

      amount: a.integer().required(),
      description: a.string().required(),
      region: a.ref("SubscriptionRegion").required(),
      level: a.integer().required(),
      isExpired: a.ref("ExpireType").required(),

      availableAt: a.date(),
      expireAt: a.date(),
      expireInDays: a.integer(),
      publish: a.boolean().default(true).required(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  TeamSubscription: a
    .model({
      team: a.hasOne("Team"),
      premier: a.ref("Subscriptions").required(),
      packages: a.hasMany("ProductPackage"),
      count: a.integer().required(),
      status: a.ref("Status").required(),
      startAt: a.datetime(),
      expireAt: a.datetime(),
      resetDate: a.datetime(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  ProductPackage: a
    .model({
      product: a.belongsTo("Product"),
      subscriptions: a.manyToMany("Subscriptions", {
        relationName: "ProductPackageSubscriptions",
      }),
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
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  SubscriptionOrder: a
    .model({
      id: a.id(),
      team: a.hasOne("Team"),
      subscriptions: a.hasOne("Subscriptions"),
      price: a.float().required(),
      currency: a.ref("PriceCurrency").required(),
      count: a.integer().required(),
      amount: a.float().required(),
      createAt: a.datetime().required(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),
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
