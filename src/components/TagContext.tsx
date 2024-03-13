"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";

import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";

const TagContext = createContext<any>(undefined);

export function TagWrapper({ children }: { children: React.ReactNode }) {
  let [selectedTag, setSelectedTag] = useState<string[]>([]);

  useEffect(() => {
    console.log("TeamWrapper useEffect called");

    const client = generateClient<Schema>({
      authMode: "apiKey",
    });
    getCurrentUser().then((user) => {
      console.log("getCurrentUser:", user);
      if (user == null) {
        return;
      }
    });
  }, []);

  return (
    <TagContext.Provider value={{ selectedTag, setSelectedTag }}>
      {children}
    </TagContext.Provider>
  );
}
export function useTagContext() {
  return useContext(TagContext);
}
