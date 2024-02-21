import { Listbox, ListboxItem, Avatar } from "@nextui-org/react";
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
      <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        <Listbox
          classNames={{
            base: "max-w-xs",
            list: "max-h-[300px] overflow-scroll",
          }}
          items={userList}
          variant="flat"
        >
          {(user) => (
            <ListboxItem key={user.id} value={user.id}>
              <div className="flex gap-2 items-center">
                <Avatar
                  alt={user.name}
                  className="flex-shrink-0"
                  size="sm"
                  src={user.avatar}
                />
                <div className="flex flex-col">
                  <span className="text-small">{user.name}</span>
                  <span className="text-tiny text-default-400">
                    {user.email}
                  </span>
                </div>
              </div>
            </ListboxItem>
          )}
        </Listbox>
      </div>
    </>
  );
}
