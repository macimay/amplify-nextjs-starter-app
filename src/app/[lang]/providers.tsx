"use client";

// import { StrictMode } from "react";
import { NextUIProvider } from "@nextui-org/react";

// import { defaultTheme } from "@adobe/react-spectrum";

import { Authenticator } from "@aws-amplify/ui-react";
import React, { StrictMode, createContext } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { ThemeProvider } from "@/components/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <StrictMode>

    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Authenticator.Provider>
        <main>{children}</main>
      </Authenticator.Provider>
    </ThemeProvider>

    // </StrictMode>
  );
}
