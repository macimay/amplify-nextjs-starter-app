"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";
import { loginStatus } from "./LoginStatus";
import { SelectionSet, generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";

const TeamContext = createContext<any>(undefined);

export function TeamWrapper({ children }: { children: React.ReactNode }) {
  const selectionSet = [
    "teamMember.user.*",
    "teamMember.role",
    "teamMember.team.*",
  ] as const;
  type SessionWithPackage = SelectionSet<
    Schema["UserSession"],
    typeof selectionSet
  >;
  let [session, setSession] = useState<SessionWithPackage>();
  let [region, setRegion] = useState<string>("CN");
  let [team, setTeam] = useState<any>();
  let [user, setUser] = useState<any>();
  let isAdmin = false;

  useEffect(() => {
    console.log("TeamWrapper useEffect called");

    loginStatus.load();
    if (loginStatus.sessionInfo)
      setSession(JSON.parse(loginStatus.sessionInfo));
    const client = generateClient<Schema>({
      authMode: "apiKey",
    });
    getCurrentUser().then((user) => {
      console.log("getCurrentUser:", user);
      if (user == null) {
        return;
      }

      const sub = client.models.UserSession.onUpdate({
        filter: { userId: { eq: user.userId } },
        selectionSet: selectionSet,
      }).subscribe({
        next: (data) => {
          console.log("UserSession event:", data);

          setSession(data);
        },
        error: (error) => {
          console.error("Error:", error);
        },
      });
    });
  }, []);
  useEffect(() => {
    console.log("TeamWrapper useEffect called", session);
    if (session?.teamMember.role === "ADMIN") {
      isAdmin = true;
    }
    loginStatus.update(JSON.stringify(session));
  }, [session]);
  return (
    <TeamContext.Provider
      value={{
        session,
        setSession,
        region,
        setRegion,
        team,
        setTeam,
        user,
        setUser,
        isAdmin,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}
export function useTeamContext() {
  return useContext(TeamContext);
}
