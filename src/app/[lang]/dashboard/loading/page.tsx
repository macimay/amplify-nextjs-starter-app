"use client";
import { useTranslations } from "next-intl";
import { AuthUser, getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "@aws-amplify/api";
import type { Schema } from "@/../amplify/data/resource"; // Path to your backend resource definition
import WelcomeComponent from "@/components/WelcomeComponent";
import { useContext, useEffect, useState } from "react";
import ErrorComponent from "@/components/ErrorComponent";
import {
  initializeUserSession,
  updateSession,
} from "@/app/[lang]/dashboard/user/action";
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
import { useRouter } from "next/navigation";
import { useTeamContext } from "@/components/TeamContext";

export default function DashboardLoading() {
  const router = useRouter();
  const client = generateClient<Schema>({
    authMode: "apiKey",
  });
  const [stage, setStage] = useState("Initializing");
  const [loadingPrompt, setLoadingPrompt] = useState("");
  const t = useTranslations("Loading");
  const { session, setSession } = useTeamContext();
  useEffect(() => {
    console.log("DashboardLoading useEffect");
    async function checkUser() {
      console.log("checkUser");

      setLoadingPrompt(t("InitializeUserSession"));
      const session = await initializeUserSession();
      setSession(session?.session);
      console.log("session:", session?.session);

      if (session?.session?.relation?.team) {
        //we got a team,so just switch to workspace
        //check if there is a team
        //use is not fresh,but not join/create any team

        console.log("team found,switch to team");

        router.replace("/dashboard/workspace");

        //load login data
      } else {
        console.log("no team found or selected,create/join/select one please");
        setStage("UserIsFresh");
      }
    }
    checkUser();
  }, []);

  if (session?.relation?.team) {
    router.replace("/dashboard/team");
    return <> </>;
  } else {
    return (
      <>
        {stage === "UserIsFresh" && (
          <div className="flex flex-col w-full h-full justify-start items-center bg-red-500">
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
          </div>
        )}
        {stage === "Initializing" && (
          <div className="flex flex-col  inset-0 w-full h-full justify-center items-center bg-red-500">
            {loadingPrompt}
          </div>
        )}
      </>
    );
  }
}
