// components/AuthCheck.tsx
import { useEffect, useState } from "react";
import { getCurrentUser } from "@aws-amplify/auth";
import { AuthUser } from "aws-amplify/auth";

const AuthCheck = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function fetchData() {
      const user = await getCurrentUser();
      setUser(user);
    }

    fetchData();
  }, []);

  if (user) {
    return <div>Welcome, {user.username}!</div>;
  } else {
    return <div>Please log in.</div>;
  }
};

export default AuthCheck;
