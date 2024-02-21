"use client";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Children, useEffect } from "react";
import { useAuthenticator, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { getCurrentUser } from "aws-amplify/auth";
import AuthenticateComponent from "@/components/Authenticate";

import { Hub } from "@aws-amplify/core";

import NavigationBar from "@/components/NavigationBar";

import DashboardLoading from "./loading/page";
import { AuthUser } from "aws-amplify/auth";
import { loginStatus } from "@/components/LoginStatus";

export default function DashbordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  const router = useRouter();
  // useEffect(() => {
  //   loginStatus.loadLoginStatus();

  // }, []);
  // const { route } = useAuthenticator((context) => [context.route]);
  // if (route == "authenticated") {
  //   router.replace("/dashboard/loading");
  // } else {
  //   router.replace("/login");
  // }

  console.log("DashboardLayout:", pathName);

  useEffect(() => {
    loginStatus.loadLoginStatus();
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
          console.log("why rerender?:", pathName);
          // router.replace("/dashboard/loading");
          return (
            <>
              <div className="flex flex-col h-screen ">
                <NavigationBar />

                {children}
              </div>
            </>
          );
        }}
      </Authenticator>
    </Authenticator.Provider>
  );
}
