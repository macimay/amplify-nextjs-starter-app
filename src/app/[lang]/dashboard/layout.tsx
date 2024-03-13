"use client";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Children, createContext, useEffect } from "react";
import { useAuthenticator, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { getCurrentUser } from "aws-amplify/auth";
import AuthenticateComponent from "@/components/Authenticate";

import { Hub } from "@aws-amplify/core";

import NavigationBar from "@/components/NavigationBar";

import DashboardLoading from "./loading/page";
import { AuthUser } from "aws-amplify/auth";
import { loginStatus } from "@/components/LoginStatus";
import { Schema } from "@/../amplify/data/resource";
import { TeamWrapper, useTeamContext } from "@/components/TeamContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  const router = useRouter();

  console.log("DashboardLayout:", pathName);
  const { session } = useTeamContext();

  useEffect(() => {
    console.log("DashboardLayout useEffect called");
    loginStatus.load();
    try {
      getCurrentUser().then((user) => {
        if (user == null) {
          router.replace("/login");
        } else {
          console.log(`The username: ${user.username}`);
          console.log(`The userId: ${user.userId}`);
          console.log(`The signInDetails: ${user.signInDetails}`);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <Authenticator.Provider>
      <Authenticator>
        {({ signOut, user }) => {
          //get team info from user
          if (session?.relation?.team == null) {
            return <DashboardLoading />;
          } else
            return (
              <>
                <div className="container flex flex-col justify-between items-center h-full gap-4">
                  {pathName.indexOf("/dashboard/loading") < 0 && (
                    <NavigationBar />
                  )}
                  <div className="flex flex-row w-full h-full mt-20">
                    {children}
                  </div>
                </div>
              </>
            );
        }}
      </Authenticator>
    </Authenticator.Provider>
  );
}
