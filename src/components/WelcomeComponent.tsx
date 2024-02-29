"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Input,
  Link,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { TextField } from "@aws-amplify/ui-react";
import {
  createTeam,
  joinTeamByInvite,
} from "@/app/[lang]/dashboard/team/actions";

import { useRouter } from "next/navigation";
import TeamListComponent from "./TeamListComponent";
import { useTeamContext } from "./TeamContext";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { updateSession } from "@/app/[lang]/dashboard/user/action";
import { getCurrentUser } from "aws-amplify/auth";

export default function WelcomeComponent() {
  const [stage, setState] = useState("Welcome");
  const t = useTranslations("Welcome");
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const { setSession } = useTeamContext();

  const handleStateChange = (name: string) => {
    setState(name);
  };
  const handleInviteJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("handleInviteJoin: ", inviteCode);
    setState("Executing");
    try {
      joinTeamByInvite({ inviteCode: inviteCode }).then((teamInfo) => {
        console.log("registerForInvite result: ", teamInfo);
        setSession(teamInfo);
      });
      router.push("/dashboard/team");
    } catch (err) {
      console.log("registerForInvite error: ", err);
    }
  };
  const handleCreateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sessionInfo = await createTeam({ teamName: teamName });
    console.log("createUserAndTeam result: ", sessionInfo);

    // loginStatus.updateTeamInfo(teamInfo.teamId, result.teamName);
    //update usersession

    setSession(sessionInfo);
    router.push("/dashboard/team");
  };

  return (
    <>
      <div className="flex flex-col">
        {stage === "Welcome" && (
          <>
            <form onSubmit={handleCreateTeam}>
              <div className="flex flex-col gap-4 w-full h-full justify-between  items-center items-stretch ">
                <div>
                  <TeamListComponent
                    callback={async (selectedTeam: Schema["Team"]) => {
                      console.log("selectedTeam: ", selectedTeam);
                      const { userId } = await getCurrentUser();
                      updateSession({
                        teamId: selectedTeam.id,
                        userId: userId,
                      })
                        .then((sessionInfo) => {
                          console.log("updateSession result:", sessionInfo);
                          // setSession(JSON.parse(sessionInfo!));
                        })
                        .catch((err) => {
                          console.log("updateSession error:", err);
                        });
                    }}
                  />
                </div>
                <Card className="h-full">
                  <CardHeader>{t("TeamTitle")}</CardHeader>
                  <CardBody>
                    <div>
                      <Input
                        isClearable
                        isRequired
                        placeholder={t("TeamInputPrompt")}
                        name="teamName"
                        value={teamName}
                        onChange={(event) => {
                          setTeamName(event.target.value);
                        }}
                      />
                    </div>
                  </CardBody>
                  <CardFooter className="justify-center gap-4">
                    <Button type="submit">Create</Button>
                  </CardFooter>
                </Card>
              </div>
            </form>
            <div>
              <p>或者</p>
            </div>
            <Divider />
            <div className="flex flex-col justify-between  items-center items-stretch gap-4">
              <form onSubmit={handleInviteJoin}>
                <Card>
                  <CardHeader>{t("inviteTitle")}</CardHeader>

                  <Input
                    placeholder={t("inviteInputPrompt")}
                    value={inviteCode}
                    onChange={(event) => {
                      setInviteCode(event.target.value);
                    }}
                  />

                  <CardFooter className="justify-center gap-4">
                    <Button type="submit">加入</Button>
                  </CardFooter>
                </Card>
              </form>
            </div>
          </>
        )}
        {stage === "Executing" && (
          <div>
            <p>Executing</p>
          </div>
        )}
        {stage === "TeamResult" && <></>}
      </div>
    </>
  );
}
function setSession(sessionInfo: string) {
  throw new Error("Function not implemented.");
}
