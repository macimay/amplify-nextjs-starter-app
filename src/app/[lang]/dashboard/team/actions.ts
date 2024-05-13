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
      adminId: userBrief.sub!,
      level: 0,
      region: "CN",
    });
  if (team == null) {
    throw {
      error: TeamError.TeamCreateFailed,
      message: `Team create failed: ${JSON.stringify(error)}`,
    };
  }
  console.log("team created: ", team);
  const { data: teamMember, errors: inviteError } =
    await cookieBasedClient.models.TeamMember.create({
      team: team,
      userId: userBrief.sub!,
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
      teamMember: teamMember,
      updateAt: new Date().toISOString(),
    });

  // console.log("session update: ", session);
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

  const { data: invite, errors: codeGetError } =
    await cookieBasedClient.models.InviteCode.list({
      filter: {
        code: { eq: inviteCode },
      },
      selectionSet: ["team.*", "teamId"],
    });
  if (codeGetError) {
    //can' find invite code
    throw {
      error: TeamError.ErrorNoInviteCode,
      message: `ErrorNoInviteCode ${JSON.stringify(codeGetError)}`,
    };
  }

  console.log("invite: ", invite);

  const { data: teamMember, errors: inviteError } =
    await cookieBasedClient.models.TeamMember.create({
      teamId: invite.teamId!,
      userId: userBrief.sub!,
      role: "MEMBER",
      joinAt: new Date().toISOString(),
      status: "ACTIVE",
    });

  return getTeamInfo(invite.teamId!, userBrief.sub!);
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

  //check current code
  const { data: inviteCode, errors: codeGetError } =
    await cookieBasedClient.models.InviteCode.get(
      {
        teamId: teamId,
      },
      {
        selectionSet: ["teamId", "code"],
      }
    );
  if (codeGetError || inviteCode.code == null || inviteCode.code == "") {
    const code = generateCode(6);
    if (refresh) {
      await cookieBasedClient.models.InviteCode.update({
        teamId: inviteCode.teamId,
        code: code,
      });
    } else {
      await cookieBasedClient.models.InviteCode.create({
        teamId: teamId,
        used: false,
        code: code,
        createAt: new Date().toISOString(),
      });
    }
    return { code: code };
  } else {
    return { code: inviteCode.code };
  }
}
function createInviteCode(teamId: string) {
  const code = generateCode(6);
  cookieBasedClient.models.InviteCode.create({
    teamId: teamId,
    used: false,
    code: code,
    createAt: new Date().toISOString(),
  });
  return code;
}
async function getTeamInfo(teamId: string, userId: string) {
  const { data: team, errors: teamError } =
    await cookieBasedClient.models.Team.get({ id: teamId });
  const { data: memberInfo, errors: memberError } =
    await cookieBasedClient.models.TeamMember.list({
      filter: {
        and: [{ teamId: { eq: teamId } }, { userId: { eq: userId } }],
      },
    });
  if (teamError) {
    console.log("get team info failed:", teamError);
    throw teamError;
  }
  if (memberError) {
    console.log("get team member info failed:", memberError);
    throw memberError;
  }
  return { team, memberInfo };
}
