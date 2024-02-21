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

export type CreateUserResultType = {
  teamId: string;
  teamName: string;
  userId: string;
  userName: string;
  sessionId: string;
  error: string;
};

export async function createUserAndTeam({ teamName }: { teamName: string }) {
  const userBrief = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchUserAttributes(contextSpec),
  });

  const result: CreateUserResultType = {
    teamId: "",
    teamName: "",
    userId: "",
    userName: "",
    sessionId: "",
    error: "",
  };

  await checkTeamAvailable({ name: teamName })
    .then((available) => {
      console.log("team name available: ", available);
      if (available) {
        console.log("team name is available");
        return registerUser({
          subId: userBrief.sub!,
          name: userBrief.preferred_username!,
        });
      } else {
        throw { errors: "Team name is not available" };
      }
    })
    .then((user) => {
      console.log("register user success: ", user);
      result.userId = user.data.id;
      result.userName = user.data.username;

      return cookieBasedClient.models.Team.create({
        name: teamName,

        teamAdminId: user.data.id,
      });
    })
    .then((team) => {
      console.log("create team success: ", team);

      result.teamId = team.data.id;
      result.teamName = team.data.name;
      return createSession({ userId: result.userId, teamId: result.teamId });
    })
    .then((session) => {
      console.log("create session success: ", session);
      result.sessionId = session.data.id;
    })
    .catch((error) => {
      console.log("create team failed: ", error);
    });

  console.log("result: ", result);
  return result;
}
/**
 * check and see if the invite code  is available
 * @param param
 * @returns
 */
export async function registerForInvite({
  inviteCode,
}: {
  inviteCode: string;
}) {
  const userBrief = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchUserAttributes(contextSpec),
  });

  const result: CreateUserResultType = {
    teamId: "",
    teamName: "",
    userId: "",
    userName: "",
    sessionId: "",
    error: "",
  };

  const { data: invites, errors: codeGetError } =
    await cookieBasedClient.models.InviteCode.list({
      filter: {
        code: {
          eq: inviteCode,
        },
      },
      selectionSet: ["team.id", "team.members.id", "team.name"],
    });
  if (codeGetError) {
    //can' find invite code
    throw { error: `ErrorNoInviteCode ${JSON.stringify(codeGetError)}` };
  }

  console.log("invites: ", invites);
  if (invites.length == 0) {
    throw { error: "ErrorNoInviteCode" };
  }
  const invite = invites[0];
  console.log("invite: ", invite);
  result.teamId = invite.team.id!;
  const team = await invite.team;

  const { data: user, errors: userRegisterError } = await registerUser({
    subId: userBrief.sub!,
    name: userBrief.preferred_username!,
  });
  if (userRegisterError) {
    throw { error: "ErrorRegisterUser" };
  }
  result.userId = user.id;
  result.userName = user.username;
  const members = await team.members.map((member) => member.id);
  members.push(user.id);

  team.members.push(user.id);

  const { data: teamUpdate, errors: teamUpdateError } =
    await cookieBasedClient.models.Team.update({
      id: result.teamId,
      members: members.join(","), // Convert the array of member ids to a single string
    });

  console.log(`add user ${user.name} to team ${team.name}: `);
  console.log("add user to team: ", result.teamId);
  const { data: session, errors: sessionError } = await createSession({
    userId: result.userId,
    teamId: result.teamId,
  });
  if (sessionError) {
    throw { error: "ErrorCreateSession" };
  }

  console.log("result: ", result);
  return result;
}
async function checkTeamAvailable({
  name,
}: {
  name: string;
}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    console.log("checkTeamAvailable: ", name);
    cookieBasedClient.models.Team.list({
      filter: {
        name: {
          eq: name,
        },
      },
    })
      .then((teams) => {
        console.log("team queried: ", teams);

        if (teams.data.length > 0) {
          console.log("team name check unavailable");
          resolve(false);
        }
        console.log("team name check available");
        resolve(true);
      })
      .catch((error) => {
        console.log("check team failed: ", error);
        return reject(error);
      });
  });
}
function registerUser({
  subId,
  name,
}: {
  subId: string;
  name: string;
}): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log("createUser: ", name);
    cookieBasedClient.models.User.create({
      cognitoId: subId,
      username: name,
      status: "ACTIVE",
    })
      .then((user) => {
        console.log("create user success: ", user);
        return resolve(user);
      })
      .catch((errors) => {
        if (errors) {
          console.log("create user failed: ", errors);
          reject(errors);
        }
      });
  });
}
function createSession({
  userId,
  teamId,
}: {
  userId: string;
  teamId: string;
}): Promise<any> {
  return new Promise((resolve, reject) => {
    cookieBasedClient.models.UserSession.create({
      userSessionUserId: userId,
      userSessionTeamId: teamId,
      start: new Date().toISOString(),
      ip: "",
    })
      .then((session) => {
        console.log("create session success: ", session);
        return resolve(session);
      })
      .catch((errors) => {
        if (errors) {
          console.log("create session failed: ", errors);
          reject(errors);
        }
      });
  });
}
