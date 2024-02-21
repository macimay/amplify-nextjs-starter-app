import { User } from "@/components/UserListComponent";

export default function UserDetailComponent({
  user,
  edit,
}: {
  user: User;
  edit: boolean;
}) {
  return (
    <>
      <div>{user.name}</div>
      <div>{user.email}</div>
      <div>{user.phone}</div>
      <div>{user.avatar}</div>
      <div>{user.status}</div>
    </>
  );
}
