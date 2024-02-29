import { Listbox, ListboxItem, User } from "@nextui-org/react";
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
      <div className="border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        <Listbox
          classNames={{
            base: "max-w-xs",
            list: "max-h-[300px] overflow-scroll",
          }}
          items={userList}
          variant="bordered"
        >
          {(user) => (
            <ListboxItem
              key={user.id}
              value={user.id}
              aria-label={user.name}
              onClick={() => onUserChange(user)}
            >
              <div className="flex gap-2 items-center">
                <User name={user.name} avatarProps={{ src: user.avatar }} />
              </div>
            </ListboxItem>
          )}
        </Listbox>
      </div>
    </>
  );
}
