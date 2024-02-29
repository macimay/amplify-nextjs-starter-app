"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";
import { loginStatus } from "./LoginStatus";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";

const TeamContext = createContext<any>(undefined);

export function TeamWrapper({ children }: { children: React.ReactNode }) {
  let [session, setSession] = useState<Schema["UserSession"] | null>(null);

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
    loginStatus.update(JSON.stringify(session));
  }, [session]);
  return (
    <TeamContext.Provider value={{ session, setSession }}>
      {children}
    </TeamContext.Provider>
  );
}
export function useTeamContext() {
  return useContext(TeamContext);
}
