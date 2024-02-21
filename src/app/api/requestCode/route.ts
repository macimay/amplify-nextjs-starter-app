import { getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/server/amplifyServerInit";
