"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Children, useEffect } from "react";
import { useAuthenticator, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import AuthenticateComponent from "@/components/Authenticate";

import { Hub } from "@aws-amplify/core";

import NavigationBar from "@/components/NavigationBar";
export default function DashbordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Navigation");

  const router = useRouter();
  useEffect(() => {
    Hub.listen("auth", (data) => {
      if (data?.payload?.event === "signedIn") {
        router.replace("/dashboard/team");
      }
    });
  }, []);

  return (
    <Authenticator.Provider>
      <Authenticator>
        {({ signOut, user }) => {
          return (
            <>
              <div>
                <NavigationBar />
              </div>

              <div>{children}</div>
            </>
          );
        }}
      </Authenticator>
    </Authenticator.Provider>
  );
}
