"use server";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";

import { runWithAmplifyServerContext } from "@/server/amplifyServerInit";
import { cookieBasedClient } from "@/server/amplifyCookieClient";

enum TeamError {
  TeamNameNotAvailable = "TeamNameNotAvailable",
  ErrorNoInviteCode = "ErrorNoInviteCode",
  ErrorRegisterUser = "ErrorRegisterUser",
  TeamCreateFailed = "TeamCreateFailed",
  GetInviteCodeFailed = "GetInviteCodeFailed",
}

function generateCode(length: number) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function createTeam({ teamName }: { teamName: string }) {
  const userBrief = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchUserAttributes(contextSpec),
  });

  const nameAvailable = await checkTeamAvailable({ name: teamName });
  if (nameAvailable) {
    console.log("team name is available");
  } else {
    throw {
      error: TeamError.TeamNameNotAvailable,
      message: "Team name not available",
    };
  }

  const { data: team, errors: error } =
    await cookieBasedClient.models.Team.create({
      name: teamName,
      teamAdminId: userBrief.sub!,
    });
  if (team == null) {
    throw {
      error: TeamError.TeamCreateFailed,
      message: `Team create failed: ${JSON.stringify(error)}`,
    };
  }

  const { data: teamMember, errors: inviteError } =
    await cookieBasedClient.models.TeamMember.create({
      teamMemberTeamId: team.id!,
      teamMemberUserId: userBrief.sub!,
      role: "ADMIN",
      joinAt: new Date().toISOString(),
      status: "ACTIVE",
    });
  if (inviteError) {
    console.log("team member create failed: ", inviteError);
  }
  const { data: session, errors: sessionError } =
    await cookieBasedClient.models.UserSession.update({
      userId: userBrief.sub!,
      userSessionRelationId: teamMember.id,
      updateAt: new Date().toISOString(),
    });

  console.log("session update: ", session);
  return JSON.stringify(session);
}
/**
 * check and see if the invite code  is available
 * @param param
 * @returns
 */
export async function joinTeamByInvite({ inviteCode }: { inviteCode: string }) {
  const userBrief = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchUserAttributes(contextSpec),
  });

  const { data: invites, errors: codeGetError } =
    await cookieBasedClient.models.InviteCode.list({
      filter: {
        code: {
          eq: inviteCode,
        },
      },
      selectionSet: ["team.id", "team.name"],
    });
  if (codeGetError) {
    //can' find invite code
    throw {
      error: TeamError.ErrorNoInviteCode,
      message: `ErrorNoInviteCode ${JSON.stringify(codeGetError)}`,
    };
  }

  console.log("invites: ", invites);
  if (invites.length == 0) {
    throw { error: TeamError.ErrorNoInviteCode, message: "ErrorNoInviteCode" };
  }
  const invite = invites[0];
  console.log("invite: ", invite);

  const { data: teamMember, errors: inviteError } =
    await cookieBasedClient.models.TeamMember.create({
      teamMemberTeamId: invite.team.id!,
      teamMemberUserId: userBrief.sub!,
      role: "MEMBER",
      joinAt: new Date().toISOString(),
      status: "ACTIVE",
    });

  console.log("join team:", invite.team);
  return invite.team;
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
export async function requestInviteCode(teamId: string, refresh: boolean) {
  const userBrief = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchUserAttributes(contextSpec),
  });
  if (refresh) {
    console.log("refresh invite code");
    await cookieBasedClient.models.InviteCode.delete({
      teamId: teamId,
    });
    const code = createInviteCode(teamId);

    return { code: code };
  } else {
    //return old ones
    const { data: inviteCode, errors: codeGetError } =
      await cookieBasedClient.models.InviteCode.list({
        filter: {
          inviteCodeTeamId: { eq: teamId },
        },
        selectionSet: ["code"],
      });
    if (codeGetError) {
      console.log("get invite code failed");
      throw {
        error: TeamError.GetInviteCodeFailed,
        message: "Error getting invite code",
      };
    }
    if (inviteCode.length == 0) {
      console.log("no invite code founded,request a new one");
      const code = createInviteCode(teamId);
      return { code: code };
    }
    return { code: inviteCode[0].code! };
  }
}
function createInviteCode(teamId: string) {
  const code = generateCode(6);
  cookieBasedClient.models.InviteCode.create({
    inviteCodeTeamId: teamId,
    used: false,
    code: code,
    createAt: new Date().toISOString(),
  });
  return code;
}
