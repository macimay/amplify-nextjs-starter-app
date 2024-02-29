import { User } from "@/components/UserListComponent";

export default function UserDetailComponent({
  user,
  edit,
}: {
  user: User | undefined;
  edit: boolean;
}) {
  return (
    <div className="bg-blue-500 h-full">
      {user == undefined ? (
        <div>no user</div>
      ) : (
        <div className="flex flex-col h-full w-full ml-20 mt-20">
          <div className="text-4xl">{user.name}</div>
          <div>{user.email}</div>
          <div>{user.phone}</div>
          <div>{user.avatar}</div>
          <div>{user.status}</div>
        </div>
      )}
    </div>
  );
}
