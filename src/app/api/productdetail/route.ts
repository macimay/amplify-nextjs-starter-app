import { getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/server/amplifyServerInit";
import { NextApiRequest } from "next";

export async function GET(req: NextApiRequest) {
  const user = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => getCurrentUser(contextSpec),
  });
  const { query } = req;
  const productId = query.productId as string;

  return NextResponse.json({ user });
}
export async function POST() {
  return NextResponse.json({ message: "POST request" });
}
