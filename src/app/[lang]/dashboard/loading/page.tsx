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

import { loginStatus } from "@/components/LoginStatus";
import { useRouter } from "next/navigation";
import { useTeamContext } from "@/components/TeamContext";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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

      setSession(JSON.parse(session.session));
      console.log("session:", session.session);

      if (session.teamMember?.team) {
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
          <div className="flex flex-col w-full h-full justify-start items-center">
            <div>
              <div className="text-base">
                <p>{t("WelcomeFreshNew")}</p>
              </div>
              <Separator className="my-20" />
              <Card>
                <Separator />
                <CardContent>
                  <WelcomeComponent />
                </CardContent>
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
