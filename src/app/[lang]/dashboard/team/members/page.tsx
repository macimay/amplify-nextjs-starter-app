"use client";
import { use, useEffect, useState } from "react";
import { type Schema } from "@/../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import UserListComponent, {
  User,
  UserStatus,
} from "@/components/UserListComponent";
import UserDetailComponent from "@/components/UserDetailComponent";
import { loginStatus } from "@/components/LoginStatus";
import { Divider } from "@nextui-org/react";

export default function TeamMemberPage() {
  const [userList, setUserList] = useState<User[]>([]);
  const [user, setActiveUser] = useState<User>();
  const { team } = useTeamContext();

  useEffect(() => {
    console.log("loginStatus.activeTeamId:", team.id);
    const client = generateClient<Schema>();

    client.models.TeamMember.list({
      filter: { teamMemberTeamId: { eq: team.id } },
      selectionSet: [
        "user.id",
        "user.username",
        "user.avatar",
        "status",
        "status",
      ],
    }).then((members) => {
      console.log("members:", members);
      const users: User[] = members.data.map(
        (member): User => ({
          id: member.user.id!,
          name: member.user.username,
          avatar: member.user.avatar ?? undefined,
          status: member.status as UserStatus, // Explicitly cast member.status to UserStatus
        })
      );
      console.log("users:", users);
      setUserList(users);
    });
  }, []);
  const handleItemChange = (userInfo: User) => {
    setActiveUser(userInfo);
  };
  return (
    <>
      <div className="container flex flex-row bg-red-500 items-start w-full h-full justify-start">
        <div className="flex justify-center  w-64 bg-green-500 w-full h-full ">
          <UserListComponent
            userList={userList}
            onUserChange={handleItemChange}
          ></UserListComponent>
        </div>

        <div className="flex flex-col bg-green-500 w-full h-full ">
          <UserDetailComponent user={user} edit={false} />
        </div>
      </div>
    </>
  );
}
