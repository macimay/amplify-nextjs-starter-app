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
  PackagePeriod: a.enum(["DAY", "MONTH", "YEAR"]),
  ExpireType: a.enum(["NEVER", "RELATIVE", "ABSOLUTE"]),
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
      subscriptions: a.hasMany("TeamSubscription"),
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
      package: a.hasMany("ProductPackage"),
      description: a.hasMany("ProductDescription"),
      publish: a.boolean().default(false).required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  TeamProductPool: a
    .model({
      id: a.id(),
      teamId: a.string().required(),
      package: a.hasOne("ProductPackage").required(),
      count: a.integer().required(),
      period: a.ref("PackagePeriod").required(),
      used: a.integer().required(),
      priority: a.integer().required(),
      status: a.ref("Status").required(),
      startAt: a.datetime(),
      expireAt: a.datetime(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  Subscriptions: a
    .model({
      id: a.id(),
      shortName: a.string().required(),
      packages: a.hasMany("ProductPackage"),
      count: a.integer().required(),
      period: a.ref("PackagePeriod").required(),
      periodStart: a.datetime(),
      periodEnd: a.datetime(),
    })
    .secondaryIndexes([a.index("shortName")])
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  TeamSubscription: a
    .model({
      id: a.id(),
      team: a.hasOne("Team").required(),
      package: a.hasOne("ProductPackage").required(),
      count: a.integer().required(),
      period: a.ref("PackagePeriod").required(),
      status: a.ref("Status").required(),
      startAt: a.datetime(),
      expireAt: a.datetime(),
      resetDate: a.datetime(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  ProductDescription: a
    .model({
      id: a.id(),
      product: a.belongsTo("Product"),
      language: a.string().required(),
      Image: a.string(),
      description: a.string(),
      enabled: a.boolean().default(false).required(),
      order: a.integer().required(),
      createdAt: a.datetime(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  ProductPackage: a
    .model({
      id: a.id(),
      product: a.belongsTo("Product"),
      name: a.string().required(),
      price: a.float().required(),
      currency: a.string().required(),
      description: a.string(),
      isExpired: a.ref("ExpireType").required(),
      expireAt: a.datetime(),
      availableAt: a.datetime(),
      expireInDays: a.integer(),

      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  PriceCurrency: a
    .model({
      id: a.id(),
      name: a.string().required(),
      code: a.string().required(),
      symbol: a.string().required(),
      rate: a.float().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  PackageOrder: a
    .model({
      id: a.id(),
      team: a.hasOne("Team").required(),
      user: a.hasOne("User").required(),
      pricePackage: a.hasOne("ProductPackage").required(),
      price: a.float().required(),
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
