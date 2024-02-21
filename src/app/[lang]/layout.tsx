// "use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

import ReactDOM from "react-dom";

import { NextIntlClientProvider, useMessages } from "next-intl";
import { Amplify } from "aws-amplify";
import AmplifyInit from "@/components/AmplifyInit";

// import AuthCheck from "./components/AuthCheck";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

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
        <AmplifyInit />
        <NextIntlClientProvider messages={t}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
export default RootLayout;
