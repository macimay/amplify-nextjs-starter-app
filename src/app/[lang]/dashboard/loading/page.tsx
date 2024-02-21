"use client";
import { useTranslations } from "next-intl";
import { AuthUser, getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "@aws-amplify/api";
import type { Schema } from "@/../amplify/data/resource"; // Path to your backend resource definition
import WelcomeComponent from "@/components/welcome/WelcomeComponent";
import { useEffect, useState } from "react";
import ErrorComponent from "@/components/ErrorComponent";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Spacer,
} from "@nextui-org/react";
import { loginStatus } from "@/components/LoginStatus";

export default function DashboardLoading() {
  const client = generateClient<Schema>({
    authMode: "apiKey",
  });
  const [stage, setStage] = useState("Initializing");
  useEffect(() => {
    async function checkUser() {
      const start = new Date().getTime();
      const user = await getCurrentUser();
      const end = new Date().getTime();
      console.log("user: used:", user, end - start);

      const mdUser = await client.models.User.list({
        filter: { cognitoId: { eq: user.userId } },
      });
      if (mdUser.data.length == 0) {
        console.log("user not registered");
        setStage("UserNotRegistered");
        return;
      } else {
        console.log("user registered");
        const userList = await client.models.UserSession.list({
          filter: {
            userSessionUserId: {
              eq: mdUser.data[0].id,
            },
          },
        });
        setStage("UserRegistered");
        console.log("userList: ", userList);
        if (!userList.data?.length) {
          console.log("user not registered");
          setStage("UserNotRegistered");
        } else {
          console.log("user registered");
          loginStatus.saveLoginStatus({
            userId: userList.data[0].userSessionUserId!,
            userName: userList.data[0].user.name,
            teamId: userList.data[0].userSessionTeamId!,
            teamName: userList.data[0].team.name,
            sessionId: userList.data[0].id,
          });

          setStage("UserRegistered");
          //load login data
        }
      }
    }
    checkUser();
  }, []);
  const t = useTranslations("Loading");

  return (
    <>
      <div className="flex flex-col position inset-0 w-full h-full justify-center items-center">
        {stage === "UserNotRegistered" && (
          <div>
            <div className="text-base">
              <p>{t("WelcomeFreshNew")}</p>
            </div>
            <Spacer y={20} />
            <Card>
              <Divider />
              <CardBody>
                <WelcomeComponent />
              </CardBody>
              <CardFooter></CardFooter>
            </Card>
          </div>
        )}
        {stage === "UserRegistered" && <div>Loading Data ing...</div>}
        {stage === "Initializing" && <div>{t("Initializing")}</div>}
      </div>
    </>
  );
}
