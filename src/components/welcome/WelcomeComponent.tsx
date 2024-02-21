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
  createUserAndTeam,
  registerForInvite,
} from "@/app/[lang]/dashboard/team/actions";
import { createWriteStream } from "fs";
import { useFormState } from "react-dom";

import { loginStatus } from "../LoginStatus";
import { useRouter } from "next/navigation";

export default function WelcomeComponent() {
  const [stage, setState] = useState("Welcome");
  const t = useTranslations("Welcome");
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleStateChange = (name: string) => {
    setState(name);
  };
  const handleInviteJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("handleInviteJoin: ", inviteCode);
    setState("Executing");
    try {
      registerForInvite({ inviteCode: inviteCode }).then((result) => {
        console.log("registerForInvite result: ", result);
        loginStatus.saveLoginStatus({
          userId: result.userId,
          userName: result.userName,
          teamId: result.teamId,
          teamName: result.teamName,
          sessionId: result.sessionId,
        });
        router.push("/dashboard/team");
      });
    } catch (err) {
      console.log("registerForInvite error: ", err);
    }
  };
  const handleCreateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await createUserAndTeam({ teamName: teamName });
    console.log("createUserAndTeam result: ", result);

    loginStatus.saveLoginStatus({
      userId: result.userId,
      userName: result.userName,
      teamId: result.teamId,
      teamName: result.teamName,
      sessionId: result.sessionId,
    });
    router.push("/dashboard/team");
  };
  return (
    <>
      <div className="flex flex-col h-48">
        {stage === "Welcome" && (
          <>
            <form onSubmit={handleCreateTeam}>
              <div className="flex flex-col gap-4 w-full h-full justify-between  items-center items-stretch ">
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
