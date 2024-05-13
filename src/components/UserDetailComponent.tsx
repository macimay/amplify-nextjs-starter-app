import { User } from "@/components/UserListComponent";
import { Button } from "./ui/button";
import DetailForm from "./admin/DetailForm";
import { TeamMemberSourceType, TeamMemberType } from "@/type/TeamMemberType";
import { Schema } from "../../amplify/data/resource";
import { useState } from "react";
import { Edit2Icon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useTranslations } from "next-intl";

import { generateClient } from "aws-amplify/api";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTeamContext } from "./TeamContext";

export default function UserDetailComponent({
  member,
}: {
  member: TeamMemberSourceType;
}) {
  const updateMemberInfo = (memberInfo: z.infer<z.ZodObject<any, any>>) => {
    console.log("updateMemberInfo1:", memberInfo);
    const client = generateClient<Schema>({ authMode: "apiKey" });
    client.models.TeamMember.update({
      id: memberInfo.id, // Fix: Add the correct type for the 'id' property
      alias: memberInfo.alias,
      title: memberInfo.type,
      role: memberInfo.role,
      status: memberInfo.status,
    }).then((result) => {
      setOpen(false);
      console.log("updateMemberInfo:result", result);
    });
  };
  const [open, setOpen] = useState<boolean>(false);
  const { isAdmin } = useTeamContext();
  const memberType = TeamMemberType.fromMember(member);
  const t = useTranslations("Team");
  return (
    <div className="h-full flex flex-col">
      <Card>
        <CardContent>
          <div className="flex flex-col h-full w-full ">
            <div className="flex flex-row justify-between m-4">
              <div className="text-4xl">{member.user.username}</div>
              {isAdmin && (
                <Dialog
                  open={open}
                  onOpenChange={(open) => {
                    setOpen(open);
                  }}
                >
                  <DialogTrigger asChild>
                    <Edit2Icon
                      size={16}
                      onClick={() => {
                        setOpen(true);
                      }}
                    />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("editMemberInfo")}</DialogTitle>
                    </DialogHeader>

                    <DetailForm
                      data={memberType}
                      onSubmitCallback={updateMemberInfo}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <div className="w-[48]px">{t("memberAlias")}</div>
                <div>{member.alias ?? t("notSet")}</div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-[48]px">{t("memberRole")}</div>
                <div>{memberType.title ?? t("notSet")}</div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-[48]px">{t("memberStatus")}</div>
                <div>{member.status}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
