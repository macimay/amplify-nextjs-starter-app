"use client";
import Sidebar from "@/components/Sidebar";
import UserProfile from "@/components/UserProfile";
import { AuthUser } from "@aws-amplify/auth";
import dynamic from "next/dynamic";
import { loginStatus } from "@/components/LoginStatus";
import { useEffect, useState } from "react";

import { Button, Divider, Link, Snippet } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";

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

  const [code, setCode] = useState("****-****");
  const [codeStatus, setCodeStatus] = useState({
    fresh: false,
    code: "***-***",
  });

  useEffect(() => {
    const client = generateClient<Schema>();
    console.log("loginStatus:", loginStatus);
    client.models.InviteCode.list({
      filter: {
        inviteCodeTeamId: { eq: loginStatus.activeTeamId! },
      },
      selectionSet: ["code"],
    }).then((inviteCode) => {
      if (inviteCode == null) {
        //create code first
        console.log("create code first");

        if (codeStatus.fresh) {
          client.models.InviteCode.delete({
            teamId: loginStatus.activeTeamId,
          });
        }
        client.models.InviteCode.create({
          inviteCodeTeamId: loginStatus.activeTeamId,
          used: false,
          code: generateCode(6),
          createAt: new Date().toISOString(),
        }).then((inviteCode) => {
          console.log("inviteCode:", inviteCode);
          setCode(inviteCode.data.code);
        });
      } else {
        console.log("inviteCode:", inviteCode);
        setCode(inviteCode.data[0].code);
      }
    });
  }, [codeStatus]);

  return (
    <div className="flex flex-col h-screen container">
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
