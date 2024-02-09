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
  return <div>Dashboard HomePage</div>;
}
