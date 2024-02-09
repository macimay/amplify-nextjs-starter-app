"use client";

// import { StrictMode } from "react";
import { NextUIProvider } from "@nextui-org/react";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextIntlClientProvider, useMessages } from "next-intl";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <StrictMode>
    <NextUIProvider>
      <NextThemesProvider defaultTheme="system">
        <main className="text-foreground bg-background w-full h-full flex flex-col">
          {children}
        </main>
      </NextThemesProvider>
    </NextUIProvider>
    // </StrictMode>
  );
}
