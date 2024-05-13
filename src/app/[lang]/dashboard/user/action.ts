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

export async function initializeUserSession() {
  const userBrief = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchUserAttributes(contextSpec),
  });
  const userLoginInfo = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => getCurrentUser(contextSpec),
  });
  const { data: user, errors: userError } =
    await cookieBasedClient.models.User.get({ id: userBrief.sub! });

  console.log("user:", userBrief, user, userError);
  console.log("userLoginInfo:", userLoginInfo);
  if (Object.keys(user).length === 0) {
    //first time login after sign up
    //create user first
    const loginId = userLoginInfo.signInDetails?.loginId!;
    console.log("create user with loginId:", loginId);
    const { data: newUser, errors: newUserError } =
      await cookieBasedClient.models.User.create({
        id: userBrief.sub!,
        accountId: loginId,
        email: userBrief.email,
        phone: userBrief.phone_number,
        username: userBrief.preferred_username!,
        status: "ACTIVE",
      });
    console.log("after create user:", newUser, newUserError);
    if (newUser) {
      //create session
      const session = await cookieBasedClient.models.UserSession.create({
        user: newUser,
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        ip: "",
      });
      return { session: JSON.stringify(session.data) };
    }
  } else {
    //use exist ,check session
    console.log("user exsit,get session:", user);
    let sessionData = await getSession(user.id!);
    console.log("sessionData:", sessionData);

    if (sessionData === null) {
      //no session recored,create new one
      console.log("create session for user:", user.id);
      const session = await cookieBasedClient.models.UserSession.create({
        userId: user.id!,
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        ip: "",
      });
      sessionData = session.data;
    }

    return { session: JSON.stringify(sessionData) };
  }
}
async function getSession(userId: string) {
  const { data: sessionData, errors: sessionError } =
    await cookieBasedClient.models.UserSession.get(
      { userId: userId },
      {
        selectionSet: [
          "userId",
          "teamMember.*",
          "teamMember.role",
          "teamMember.team.*",
          "createAt",
          "updateAt",
        ],
      }
    );
  if (sessionError) {
    console.log(
      "error get session by user:",
      userId,
      " error is:",
      sessionError
    );
    return null;
  }
  if (!sessionData || sessionData.hasOwnProperty("userId") == false) {
    return null;
  }

  return sessionData;
}
export async function updateSession({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) {
  console.log("update session:", teamId, userId);
  const { data: teamMember, errors: teamMemberError } =
    await cookieBasedClient.models.TeamMember.list({
      filter: {
        and: [{ teamId: { eq: teamId } }, { userId: { eq: userId } }],
      },
    });
  if (teamMemberError || teamMember.length === 0) {
    console.log("team member error:", teamMemberError);
    throw { error: "TeamMemberError", message: teamMemberError };
  }

  const { data: session, errors: sessionError } =
    await cookieBasedClient.models.UserSession.update({
      userId: userId,
      teamMember: teamMember[0],
      updateAt: new Date().toISOString(),
    });
  if (sessionError) {
    console.log("update session error:", sessionError);
    throw { error: "UpdateSessionError", message: sessionError };
  }
  return JSON.stringify(session);
}
