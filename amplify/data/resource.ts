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
  UserStatus: a.enum(["ACTIVE", "SUSPEND", "CLOSED"]),
  UserRole: a.enum(["ADMIN", "MEMBER"]),
  User: a
    .model({
      id: a.id(),

      username: a.string().required(),
      accountId: a.string().required(),
      avatar: a.string(),
      email: a.email(),
      phone: a.phone(),
      status: a.ref("UserStatus").required(),
    })
    .authorization([
      a.allow.public().to(["read", "create", "delete", "update"]),
    ]),

  Team: a
    .model({
      name: a.string().required(),
      icon: a.string(),
      admin: a.hasOne("User").required(),
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
      status: a.ref("UserStatus").required(),
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
      id: a.id(),
      name: a.string().required(),

      isPublished: a.boolean().default(false),
      createdAt: a.datetime().default(() => new Date()),
      updatedAt: a.datetime().default(() => new Date()),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  PricePackage: a
    .model({
      id: a.id(),
      name: a.string().required(),
      product: a.hasOne("Product").required(),
      price: a.float().required(),
      currency: a.string().required(),
      description: a.string(),
      createdAt: a.datetime().default(() => new Date()),
      updatedAt: a.datetime().default(() => new Date()),
    })
    .authorization([a.allow.public().to(["read", "create", "update"])]),

  TeamOrder: a
    .model({
      id: a.id(),
      team: a.hasOne("Team").required(),
      pricePackage: a.hasOne("PricePackage").required(),
      startDate: a.datetime().required(),
      endDate: a.datetime().required(),
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
