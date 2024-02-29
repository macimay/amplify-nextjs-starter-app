"use client";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  //redirect to login page if authStatus is false
  //   useEffect(() => {
  //     if (authStatus !== "authenticated") {
  //       router.push("/login");
  //     }
  //   }, []);
  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex flex-col">
        <h1>Dashboard</h1>
        <p>Welcome to the dashboard</p>
      </div>
    </div>
  );
}
