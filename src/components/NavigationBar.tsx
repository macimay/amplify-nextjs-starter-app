"use client";

import { useTranslations } from "next-intl";

// components/NavigationBar.js
import React from "react";

import ThemeSwitcher from "./ThemeSwitcher";
import { HeartIcon, HomeModernIcon } from "@heroicons/react/24/outline";

import { LanguageIcon } from "@heroicons/react/16/solid";
import { usePathname, useRouter } from "@/navigation";

import { Authenticator } from "@aws-amplify/ui-react";

import { useTeamContext } from "./TeamContext";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

import { Dropdown } from "react-day-picker";

export default function NavigationBar() {
  const t = useTranslations("Navigation");

  const router = useRouter();
  const pathname = usePathname();
  console.log("new path: ", pathname);

  const handleLanguageChange = (newLocale: string) => {
    // Fix: Remove the object wrapper around newLocale
    router.push(pathname, { locale: newLocale });
  };
  const { session } = useTeamContext();

  const menus = {
    workspace: [],
    team: [
      {
        key: "MenuTeamIndex",
        title: t("menuMain"),
        path: "/dashboard/team",
        icon: "HomeModernIcon",
      },
      {
        key: "MenuTeamMember",
        title: t("menuMember"),
        path: "/dashboard/team/members",
        icon: "HeartIcon",
      },
      {
        key: "MenuTeamPrice",
        title: t("menuPrice"),
        path: "/dashboard/team/price",
        icon: "HeartIcon",
      },
      {
        key: "MenuTeamSetting",
        title: t("menuSetting"),
        path: "/dashboard/team/settings",
        icon: "HeartIcon",
      },
      {
        key: "MenuTeamOrder",
        title: t("menuOrder"),
        path: "/dashboard/team/order",
        icon: "HeartIcon",
      },
    ],
    profile: [],
  };

  return (
    <Authenticator>
      {({ signOut, user }) => {
        return (
          <div className="flex flex-row items-center justify-between px-4 py-2 w-full">
            <NavigationMenu>
              <NavigationMenuList className="hidden sm:flex gap-4">
                <NavigationMenuItem>
                  <Link
                    href="/dashboard/workspace"
                    color="primary"
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {t("workspace")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/dashboard/marketplace" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {t("marketplace")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/dashboard/practice" legacyBehavior passHref>
                    <NavigationMenuLink>{t("practice")}</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/dashboard/document" legacyBehavior passHref>
                    <NavigationMenuLink>{t("documents")}</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/dashboard/team" legacyBehavior passHref>
                    <NavigationMenuLink>{t("teamInfo")}</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex flex-row justify-end items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center flex-row">
                    <img
                      src="https://gravatar.com/avatar/0c9997d53bad0e7f2a0b25bb9b1888b5?s=400&d=robohash&r=x"
                      width={16}
                      alt="avatar"
                    />
                    <p>{session.teamMember.team?.name}</p>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem key="teamSwitch" title="teamSwitch">
                    {t("profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem key="logout" title="signOut">
                    {t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <ThemeSwitcher />

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center">
                  <LanguageIcon className="h-6 w-6" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup onValueChange={handleLanguageChange}>
                    <DropdownMenuRadioItem value="en" aria-label="ENGLISH">
                      ENGLISH
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="cn"
                      aria-label="cn"
                      title="简体中文"
                    >
                      简体中文
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          // {/* {pathname.indexOf("/dashboard/team") >= 0 && (
          //   <Tabs>
          //     {menus.team.map((menu) => (
          //       <Tab key={menu.key} title={menu.title} href={menu.path} />
          //     ))}
          //   </Tabs>
          // )} */}
        );
      }}
    </Authenticator>
  );
}
