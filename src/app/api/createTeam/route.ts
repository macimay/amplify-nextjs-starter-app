import { getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/server/amplifyServerInit";

export async function GET() {
  const user = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => getCurrentUser(contextSpec),
  });

  return NextResponse.json({ user });
}
export async function POST() {
  return NextResponse.json({ message: "POST request" });
}
