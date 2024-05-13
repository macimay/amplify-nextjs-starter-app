"use client";
import Sidebar from "@/components/Sidebar";
import UserProfile from "@/components/profile/UserProfile";
import { AuthUser } from "@aws-amplify/auth";
import dynamic from "next/dynamic";
import { loginStatus } from "@/components/LoginStatus";
import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { requestInviteCode } from "./actions";
import { useTeamContext } from "@/components/TeamContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Space } from "lucide-react";

// Import the 'Auth' module from the 'aws-amplify' package

// Import the 'useEffect' and 'useState' hooks from the 'react' package

function generateCode(length: number) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default function TeamMembersPage() {
  const teamSubscriptionSelectionSet = [
    "id",
    "startAt",
    "expireAt",
    "periodicStart",
    "periodicEnd",
    "priority",
    "used",
    "capacity",
    "package.*",
    "package.product.*",
    "subscriptionId",
  ] as const;
  type TeamSubscriptionDataType = SelectionSet<
    Schema["SubscriptionPool"],
    typeof teamSubscriptionSelectionSet
  >;
  const t = useTranslations("Team");

  console.log(loginStatus);

  const [code, setCode] = useState("XXXXXX");
  const [refreshCode, setRefresh] = useState(0);
  const [subscriptions, setSubscriptions] = useState<
    TeamSubscriptionDataType[]
  >([]);

  const { session } = useTeamContext();

  useEffect(() => {
    console.log("load invite code:", session.teamMember?.team.id);

    requestInviteCode(session.teamMember?.team.id, false)
      .then((code) => {
        console.log("code:", code);
        if (code) setCode(code.code); // Fix: Access the code property of the first element in the array
      })
      .catch((err) => {
        console.log("error:", err);
      });
  }, [session]);
  useEffect(() => {
    requestInviteCode(session.teamMember?.team.id, false)
      .then((code) => {
        console.log("code:", code);
        if (code) setCode(code?.code); // Fix: Access the code property of the first element in the array
      })
      .catch((err) => {
        console.log("error:", err);
      });
    const client = generateClient<Schema>({
      authMode: "apiKey",
    });

    client.models.SubscriptionPool.list({
      filter: {
        teamId: { eq: session.teamMember?.team.id },
      },
      teamSubscriptionSelectionSet,
    }).then((data) => {
      console.log("team subscriptions:", data.data);
      setSubscriptions(data.data);
    });
  }, []);

  return (
    <div className="flex flex-col h-screen container  items-center">
      <div>
        <div className="adjust-start">
          <p className="  text-3xl bold">{t("memberInviteTitle")}</p>
        </div>
        <Separator className="my-4" />
        <div className="flex h-32 justify-center text-4xl mt-4">
          <p className="text-4lg">{code}</p>
        </div>
        <div className="flex justify-center">
          <Link href={""}>{t("memberInvite")}</Link>
        </div>
      </div>

      <div className="adjust-start text-3xl bold">{t("teamProperty")}</div>
      <Separator className="my-4" />
      <div className="container flex flex-col items-center">
        {subscriptions.map((pool) => {
          return (
            <div className="container flex flex-row justify-start">
              <div className=" w-1/4 ">{pool.package.product.name}</div>
              <div className="w-1/8 justify-start ">{pool.startAt}</div>
              <div className="w-1/8">{pool.expireAt}</div>
              <div className="flex flex-row w-1/4 justify-stretch items-center">
                <progress
                  value={(pool.used * 1.0) / pool.capacity}
                  max="1"
                ></progress>
                {pool.used}/{pool.capacity}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row justify-center w-full">
        <Button asChild>
          <Link href="/dashboard/marketplace">{t("buyMore")}</Link>
        </Button>
      </div>
    </div>
  );
}
