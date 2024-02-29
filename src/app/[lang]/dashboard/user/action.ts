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
        userId: user.id!,
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        ip: "",
      });
    }
  } else {
    //create session
    console.log("user exsit,get session:", user);
    let sessionData = await getSession(user.id!);

    if (sessionData == null) {
      const session = await cookieBasedClient.models.UserSession.create({
        userId: user.id!,
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        ip: "",
      });
      sessionData = await getSession(user.id!);
    }

    return { session: sessionData };
  }
}
async function getSession(userId: string) {
  const { data: sessionData, errors: sessionError } =
    await cookieBasedClient.models.UserSession.get(
      { userId: userId! },
      {
        selectionSet: [
          "userId",
          "createAt",
          "relation.*",
          "relation.team.*",
          "relation.user.*",
          "updateAt",
          "ip",
        ],
      }
    );
  if (sessionError) {
    console.log("get session error:", sessionError);
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
  const { data: teamMember, errors: teamMemberError } =
    await cookieBasedClient.models.TeamMember.list({
      filter: {
        and: [
          { teamMemberTeamId: { eq: teamId } },
          { teamMemberUserId: { eq: userId } },
        ],
      },
    });
  if (teamMemberError || teamMember.length === 0) {
    console.log("team member error:", teamMemberError);
    throw { error: "TeamMemberError", message: teamMemberError };
  }
  console.log("team member:", teamMember);
  const { data: session, errors: sessionError } =
    await cookieBasedClient.models.UserSession.update({
      userId: userId,
      userSessionRelationId: teamMember[0].id,
      updateAt: new Date().toISOString(),
    });
  if (sessionError) {
    console.log("update session error:", sessionError);
    throw { error: "UpdateSessionError", message: sessionError };
  }

  return getSession(userId);
}
