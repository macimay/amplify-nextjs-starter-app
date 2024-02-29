import { AuthUser } from "@aws-amplify/auth";
import { User } from "../UserListComponent";
import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Image,
  Spacer,
  Input,
} from "@nextui-org/react";
import { Schema } from "../../../amplify/data/resource";
import { useTranslations } from "next-intl";
import { ProfileItem, UpdateProfileItemFunc } from "./ProfileItem";
import { generateClient } from "aws-amplify/api";
import { useTeamContext } from "../TeamContext";

export default function UserProfile() {
  const { session, setSession } = useTeamContext();
  const user = session?.relation.user;
  const update: UpdateProfileItemFunc = (key, value) => {
    console.log("update: ", key, value);
    return new Promise((resolve, reject) => {
      const client = generateClient<Schema>({
        authMode: "apiKey",
      });
      client.models.User.update({
        id: session?.relation.user.id!,
        [key]: value,
      }).then((result) => {
        console.log("update result:", result);
        setSession({
          ...session,
          relation: { ...session.relation, user: result.data },
        });
      });
      console.log("update: ", key, value);

      resolve({ result: true, updateValue: value });
    });
  };
  const t = useTranslations("ProfilePage");

  return (
    <div className="flex flex-row justify-start w-[640px]">
      <Card>
        <CardBody className="flex justify-center items-start">
          <div className="flex flex-col justify-center items-center w-[180px] ">
            <div className="flex flex-row justify-center items-center">
              <Image
                src={user.avatar ?? "/assets/picture/user.png"}
                width={100}
                height={400}
                alt="avatar"
              />
            </div>
            <Spacer y={8} />
            <p className="text-4xl">{user.username}</p>
          </div>
        </CardBody>
      </Card>
      <Card className="w-[540px]">
        <CardBody>
          <div className="flex flex-col justify-center items-center gap-4">
            <ProfileItem
              name="username"
              label="Name"
              value={user.username}
              callback={update}
            />
            <Divider />
            <ProfileItem
              name="accountId"
              label={t("accountId")}
              value={user.accountId}
              readonly={true}
              callback={update}
            />
            <Divider />
            <ProfileItem
              name="email"
              label={t("email")}
              value={user.email?.toString() ?? ""}
              callback={update}
            />
            <Divider />
            <ProfileItem
              name="phone"
              label={t("phone")}
              value={user.phone?.toString() ?? ""}
              callback={update}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
