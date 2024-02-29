"use client";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState, useTransition, type Key } from "react";
import { Schema } from "@/../amplify/data/resource";
import { loginStatus } from "@/components/LoginStatus";
import { useRouter } from "next/navigation";
import {
  Image,
  Listbox,
  ListboxItem,
  SelectSection,
  Tab,
  Tabs,
} from "@nextui-org/react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spacer,
} from "@nextui-org/react";

import { useTranslations } from "next-intl";

import UserProfile from "@/components/profile/UserProfile";

import TeamProfilePersonal from "@/components/profile/TeamProfilePersonal";
import { useTeamContext } from "@/components/TeamContext";
import SecurityProfile from "@/components/profile/SecurityComponent";
import VerticalTabs from "@/components/VerticalTab";

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
              <CardBody>
                <div className="flex  justify-start flex-growth items-center ">
                  <UserProfile />
                </div>
              </CardBody>
            </Card>
          )}
          {section == "team" && (
            <Card className="w-full">
              <CardBody>
                <TeamProfilePersonal />
              </CardBody>
            </Card>
          )}
          {section == "security" && (
            <Card className="w-full">
              <CardBody>
                <SecurityProfile />
              </CardBody>
            </Card>
          )}
        </div>

        <div className="w-40 justify-end flex mt-10">
          <Card>
            <CardBody>
              <div className="flex  justify-center items-center">
                <VerticalTabs
                  tabs={tabList}
                  callback={(key) => {
                    setSection(key);
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
