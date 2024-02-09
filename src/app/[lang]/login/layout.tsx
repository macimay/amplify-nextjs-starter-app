"use client";
import { useAuthenticator, Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Authenticator.Provider>{children}</Authenticator.Provider>
    </>
  );
}
