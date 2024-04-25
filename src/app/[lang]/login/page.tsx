"use client";

import "@aws-amplify/ui-react/styles.css";
import {
  Authenticator,
  useAuthenticator,
  withAuthenticator,
} from "@aws-amplify/ui-react";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import { Hub } from "aws-amplify/utils";

export default function LoginPage() {
  const router = useRouter();
  const { route } = useAuthenticator((context) => [context.route]);

  useEffect(() => {
    Hub.listen("auth", (data) => {
      console.log("A new auth event has happened: ", data.payload.event);
      if (data?.payload?.event === "signedIn") {
        router.replace("/dashboard/loading");
      }
    });
    console.log("after useEffect");
  }, []);

  return (
    <>
      <div className="flex justify-end ">
        <Authenticator></Authenticator>
      </div>
    </>
  );
}
// export default withAuthenticator(Login);
