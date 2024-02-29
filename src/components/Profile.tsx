import { User } from "./UserListComponent";

export default function Profile({ user }: { user: User }) {
  return (
    <>
      <div>
        <div className="flex flex-col h-full w-full ml-20 mt-20">
          <div className="text-4xl">{user.name}</div>
          <div>{user.email}</div>
          <div>{user.phone}</div>
          <div>{user.avatar}</div>
          <div>{user.status}</div>
        </div>
      </div>
    </>
  );
}
