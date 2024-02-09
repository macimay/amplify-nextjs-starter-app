import { Pathnames } from "next-intl/navigation";

export const locales = ["en", "cn"] as const;

export const pathnames = {
  "/": "/",
  "/pathnames": {
    en: "/pathnames",
    cn: "/pathnames",
  },
} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = "as-needed";

export type AppPathnames = keyof typeof pathnames;
