// components/ConfigureAmplify.tsx
"use client";

import outputs from "@/../amplify_outputs.json";
import { Amplify } from "aws-amplify";

Amplify.configure(outputs, { ssr: true });

console.log("amplify init");
export default function ConfigureAmplifyClientSide() {
  return <></>;
}
