"use client";

// import { StrictMode } from "react";
import { NextUIProvider } from "@nextui-org/react";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
  ThemeProvider as AmplifyThemeProvider,
  defaultDarkModeOverride,
  ColorMode,
} from "@aws-amplify/ui-react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Authenticator } from "@aws-amplify/ui-react";
import React, { StrictMode, createContext } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = React.useState<ColorMode>("system");
  const theme = {
    name: "my-theme",
    overrides: [defaultDarkModeOverride],
    colorMode: "dark",
  };
  return (
    // <StrictMode>
    <NextUIProvider>
      <NextThemesProvider defaultTheme="dark">
        <Authenticator.Provider>
          <main className="text-foreground bg-background w-full h-screen flex flex-col items-center justify-start ">
            {children}
          </main>
        </Authenticator.Provider>
      </NextThemesProvider>
    </NextUIProvider>
    // </StrictMode>
  );
}
