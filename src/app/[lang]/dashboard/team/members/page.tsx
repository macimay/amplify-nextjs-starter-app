"use client";
import { use, useEffect, useState } from "react";
import { type Schema } from "@/../amplify/data/resource";
import { SelectionSet, generateClient } from "aws-amplify/data";

import UserDetailComponent from "@/components/UserDetailComponent";
import { loginStatus } from "@/components/LoginStatus";

import { useTeamContext } from "@/components/TeamContext";
import TeamMemberComponent from "@/components/TeamMemberComponent";
import { isTeamAdmin } from "@/lib/utils";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty,
} from "@/components/ui/command";

import { TeamMemberSourceType, teamMemberType } from "@/type/TeamMemberType";
import { Check, User } from "lucide-react";
import { cn } from "@/lib/utils";
import PaginationComponent from "@/components/PaginationComponent";

export default function TeamMemberPage() {
  const [memberList, setMemberList] = useState<TeamMemberSourceType[]>([]);
  const [user, setActiveUser] = useState<TeamMemberSourceType>();
  const { session, isAdmin } = useTeamContext();
  const tokens: string[] = [];
  const itemsPerPage: number = 10;
  const [nextToken, setNextToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("loginStatus.activeTeamId:", session.teamMember.team.id);
    const client = generateClient<Schema>({
      authMode: "apiKey",
    });

    client.models.TeamMember.list({
      filter: {
        teamId: { eq: session.teamMember.team.id },
      },
      selectionSet: teamMemberType,
    }).then(({ data, nextToken, errors }) => {
      if (!errors) {
        console.log("members:", data);
        setNextToken(nextToken);
        setMemberList(data);
      } else {
        console.log("get member list error:", errors);
      }
    });
    if (isAdmin) {
      client.models.TeamMember.onUpdate({
        filter: {
          teamId: { eq: session.teamMember.team.id },
        },
      }).subscribe({
        next: (data) => {
          console.log("TeamMember event:", data);
          setMemberList(data);
        },
        error: (error) => {
          console.error("Error:", error);
        },
      });
    } else {
      console.log("is not admin");
    }
  }, []);
  const handleItemChange = (userInfo: TeamMemberSourceType) => {
    setActiveUser(userInfo);
  };
  return (
    <>
      <div className="container flex flex-row  w-full h-full justify-space gap-4">
        <div className="flex flex-col  w-1/4 h-full">
          <Command className="rounded-lg border shadow-md">
            <CommandGroup>
              <CommandList>
                <CommandInput placeholder="Search user..." />
                <CommandEmpty>No framework found.</CommandEmpty>

                {memberList.map((member) => (
                  <CommandItem
                    key={member.id}
                    value={member.id}
                    onSelect={(currentValue) => {
                      console.log("member selected:", currentValue);
                      handleItemChange(member);
                    }}
                  >
                    <span> {member.user.username}</span>
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
          <div>
            <PaginationComponent
              nextToken={nextToken}
              callback={(pageNo) => {}}
            />
          </div>
        </div>

        <div className="flex flex-col w-3/4 justify-center">
          {user ? (
            <UserDetailComponent member={user} />
          ) : (
            <div>no user selected</div>
          )}
        </div>
      </div>
    </>
  );
}
