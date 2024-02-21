"use client";
import { useEffect, useState } from "react";
import { type Schema } from "@/../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import UserListComponent, {
  User,
  UserStatus,
} from "@/components/UserListComponent";
import UserDetailComponent from "@/components/UserDetailComponent";
import { loginStatus } from "@/components/LoginStatus";

export default function TeamMemberPage() {
  const [userList, setUserList] = useState<User[]>([]);
  const [user, setActiveUser] = useState<User>();

  useEffect(() => {
    console.log("loginStatus.activeTeamId:", loginStatus.activeTeamId);
    const client = generateClient<Schema>();

    client.models.Team.get({ id: loginStatus.activeTeamId }).then((team) => {
      console.log("team:", team);
      team.data.members().then((members) => {
        console.log("members:", members);
        const users: User[] = members.data.map(
          (member): User => ({
            id: member.id,
            name: member.username,
            avatar: member.avatar ?? undefined,
            status: member.status as unknown as UserStatus, // Explicitly cast member.status to UserStatus
          })
        );
        console.log("users:", users);
        setUserList(users);
      });
    });
  }, []);
  const handleItemChange = (userInfo: User) => {
    setActiveUser(userInfo);
  };
  return (
    <>
      <div className="flex flex-row">
        <div className="w-320">
          <UserListComponent
            userList={userList}
            onUserChange={handleItemChange}
          />
        </div>
      </div>
    </>
  );
}
