import { AuthUser } from "@aws-amplify/auth";
import { User } from "../UserListComponent";
import { useState } from "react";

import { Schema } from "../../../amplify/data/resource";
import { useTranslations } from "next-intl";
import { ProfileItem, UpdateProfileItemFunc } from "./ProfileItem";
import { generateClient } from "aws-amplify/api";
import { useTeamContext } from "../TeamContext";
import Profile from "../Profile";
import { Card, CardContent } from "../ui/card";
import { Separator } from "@radix-ui/react-select";

export default function TeamUserProfile() {
  const { session, setSession } = useTeamContext();

  const team = session?.relation.team;
  const teamMember = session?.relation;
  const update: UpdateProfileItemFunc = (key, value) => {
    console.log("update: ", key, value);
    return new Promise((resolve, reject) => {
      const client = generateClient<Schema>({
        authMode: "apiKey",
      });
      if (key === "teamName") {
        console.log("team.id:", team.id);
        client.models.Team.update({
          id: team.id!,
          name: value,
        })
          .then((result) => {
            console.log("update result:", result);
            setSession({
              ...session,
              relation: { ...session.relation, team: result.data },
            });
          })
          .catch((err) => {
            console.log("update error:", err);
          });
      }
      // client.models.User.update({
      //   id: user.id!,
      //   [key]: value,
      // }).then((result) => {
      //   console.log("update result:", result);
      //   setUser(result.data);
      // });
      console.log("update: ", key, value);

      resolve({ result: true, updateValue: value });
    });
  };
  const t = useTranslations("ProfilePage");
  return (
    <div className="flex flex-col justify-start items-start w-[640px]">
      <Card className="w-full">
        <CardContent className="w-full">
          <div className="flex flex-col justify-center items-center gap-4">
            <ProfileItem
              name="teamName"
              label={t("LabelTeamName")}
              value={team.name}
              callback={update}
            />
            <Separator />
            <ProfileItem
              name="teamAlias"
              label={t("LabelTeamAlias")}
              value={teamMember.alias}
              callback={update}
            />
            <ProfileItem
              name="teamTitle"
              label={t("LabelTeamTitle")}
              value={teamMember.title}
              callback={update}
            />
            <ProfileItem
              name="teamRole"
              label={t("LabelTeamRole")}
              value={teamMember.role}
              callback={update}
              readonly
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
