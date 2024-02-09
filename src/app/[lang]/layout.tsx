// "use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

import ReactDOM from "react-dom";
// import awsConfig from "@/amplifyconfiguration.json";

import { NextIntlClientProvider, useMessages } from "next-intl";
// import AuthCheck from "./components/AuthCheck";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

import { Amplify, ResourcesConfig } from "aws-amplify";

import awsConfig from "@/amplifyconfiguration.json";
import NavigationBar from "@/components/NavigationBar";

import { defaultStorage } from "aws-amplify/utils";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";

const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: "ap-northeast-2_M64a81C79",
    userPoolClientId: "ap-northeast-2:8776a63a-7059-450b-ba3c-349fe3d1afd9",
  },
};

cognitoUserPoolsTokenProvider.setAuthConfig(authConfig);
cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);

console.log("before Amplify configure");

// Amplify.configure(
//   {
//     Auth: authConfig,
//   },
//   { Auth: { tokenProvider: cognitoUserPoolsTokenProvider } }
// );
Amplify.configure(awsConfig, { ssr: true });

function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const t = useMessages();

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={t}>
          <div>
            <NavigationBar />
          </div>

          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
export default RootLayout;