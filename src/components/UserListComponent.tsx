import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPEND = "SUSPEND",
  CLOSED = "CLOSED",
}
export type User = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: UserStatus;
};
export default function userListComponent({
  userList,
  onUserChange,
}: {
  userList: User[];
  onUserChange: (userInfo: User) => void;
}) {
  return (
    <>
      <div className="flex flex-col border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        <div>
          {userList.map((user) => (
            <div
              id={user.id}
              aria-label={user.name}
              onClick={() => onUserChange(user)}
            >
              <div className="flex gap-2 items-center">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
