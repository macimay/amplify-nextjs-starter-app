import { AuthUser } from "@aws-amplify/auth";

export default function UserProfile({ userInfo }: { userInfo: AuthUser }) {
  return <div>User Profile {userInfo.username}</div>;
}
