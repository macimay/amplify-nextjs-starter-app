"use server";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/server/amplifyServerInit";
import { cookieBasedClient } from "@/server/amplifyCookieClient";
import { type Schema } from "@/../amplify/data/resource";
import { rejects } from "assert";
import { resolve } from "path";
import { error } from "console";

export async function getProductDetail({ productName }: { productName: string }) {
  const user = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => getCurrentUser(contextSpec),
  });


  
  return NextResponse.json({ user });
}
