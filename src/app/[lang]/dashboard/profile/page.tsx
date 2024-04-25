"use client";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState, useTransition, type Key } from "react";
import { Schema } from "@/../amplify/data/resource";
import { loginStatus } from "@/components/LoginStatus";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import UserProfile from "@/components/profile/UserProfile";

import TeamProfilePersonal from "@/components/profile/TeamProfilePersonal";
import { useTeamContext } from "@/components/TeamContext";
import SecurityProfile from "@/components/profile/SecurityComponent";
import VerticalTabs from "@/components/VerticalTab";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  const router = useRouter();
  const { session } = useTeamContext();

  const t = useTranslations("ProfilePage");

  const [section, setSection] = useState<Key>("basic");

  const tabList = [
    { key: "basic", title: t("tabPersonal"), content: "" },
    { key: "team", title: t("tabTeam"), content: "" },
    { key: "security", title: t("tabSecurity"), content: "" },
  ];

  return (
    <>
      <div className="flex  justify-center w-200 items-start h-full bg-blue-500">
        <div className="flex w-148 flex-col">
          <div className="flex justify-start items-center mb-4">
            <h1 className="text-4xl">{section.toString()}</h1>
          </div>
          {section == "basic" && (
            <Card className="w-full">
              <CardContent>
                <div className="flex  justify-start flex-growth items-center ">
                  <UserProfile />
                </div>
              </CardContent>
            </Card>
          )}
          {section == "team" && (
            <Card className="w-full">
              <CardContent>
                <TeamProfilePersonal />
              </CardContent>
            </Card>
          )}
          {section == "security" && (
            <Card className="w-full">
              <CardContent>
                <SecurityProfile />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="w-40 justify-end flex mt-10">
          <Card>
            <CardContent>
              <div className="flex  justify-center items-center">
                <VerticalTabs
                  tabs={tabList}
                  callback={(key) => {
                    setSection(key);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
