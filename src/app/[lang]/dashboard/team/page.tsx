"use client";
import Sidebar from "@/components/Sidebar";
import UserProfile from "@/components/profile/UserProfile";
import { AuthUser } from "@aws-amplify/auth";
import dynamic from "next/dynamic";
import { loginStatus } from "@/components/LoginStatus";
import { useEffect, useState } from "react";

import { Button, Divider, Link, Snippet } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { requestInviteCode } from "./actions";
import { useTeamContext } from "@/components/TeamContext";

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
  const t = useTranslations("Team");

  console.log(loginStatus);

  const [code, setCode] = useState("xxx");
  const [refreshCode, setRefresh] = useState(0);
  const { session } = useTeamContext();

  useEffect(() => {
    console.log("load invite code:", session.relation.team.id);

    requestInviteCode(session.relation.team.id, false)
      .then((code) => {
        console.log("code:", code);
        setCode(code.code); // Fix: Access the code property of the first element in the array
      })
      .catch((err) => {
        console.log("error:", err);
      });
  }, [session]);
  useEffect(() => {
    requestInviteCode(session.relation.team.id, false)
      .then((code) => {
        console.log("code:", code);
        setCode(code.code); // Fix: Access the code property of the first element in the array
      })
      .catch((err) => {
        console.log("error:", err);
      });
  }, []);

  return (
    <div className="flex flex-col h-screen container ">
      <div className="adjust-start text-3xl bold">{t("memberInviteTitle")}</div>
      <Divider />
      <div className="flex h-32 justify-center text-4xl">
        <Snippet size="lg">{code}</Snippet>
      </div>
      <div className="flex justify-center">
        <Link>{t("memberInvite")}</Link>
      </div>
    </div>
  );
}
