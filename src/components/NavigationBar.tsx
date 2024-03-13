"use client";

import { useTranslations } from "next-intl";

import {
  Image,
  Link,
  NavbarMenu,
  Select,
  Spacer,
  Tab,
  Tabs,
} from "@nextui-org/react";

// components/NavigationBar.js
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";

import ThemeSwitcher from "./ThemeSwitcher";
import { HeartIcon, HomeModernIcon } from "@heroicons/react/24/outline";

import { LanguageIcon } from "@heroicons/react/16/solid";
import { usePathname, useRouter } from "@/navigation";

import { Authenticator } from "@aws-amplify/ui-react";

import { useTeamContext } from "./TeamContext";

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
          <div className="flex flex-col container">
            <Navbar maxWidth="full">
              <NavbarBrand>
                <Image src="/assets/picture/logo.png" alt="logo" />
              </NavbarBrand>
              <NavbarContent className="hidden sm:flex gap-4" justify="start">
                <NavbarItem>
                  <Button
                    as={Link}
                    href="/dashboard/workspace"
                    color="primary"
                    variant={
                      pathname.indexOf("/dashboard/workspace") >= 0
                        ? "solid"
                        : "flat"
                    }
                  >
                    {t("workspace")}
                  </Button>
                </NavbarItem>
                <NavbarItem>
                  <Link href="/dashboard/marketplace" color="primary">
                    {t("marketplace")}
                  </Link>
                </NavbarItem>

                <NavbarItem>
                  <Link href="/dashboard/practice">{t("practice")}</Link>
                </NavbarItem>
                <NavbarItem>
                  <Link href="/dashboard/document">{t("documents")}</Link>
                </NavbarItem>
                <NavbarItem>
                  <Link href="/dashboard/team">{t("teamInfo")}</Link>
                </NavbarItem>
              </NavbarContent>
              <NavbarContent justify="end">
                <Dropdown>
                  <NavbarItem>
                    <DropdownTrigger>
                      <div className="flex items-center flex-row">
                        <Image
                          src="https://gravatar.com/avatar/0c9997d53bad0e7f2a0b25bb9b1888b5?s=400&d=robohash&r=x"
                          width={16}
                          alt="avatar"
                        />
                        <p>{session.relation.team?.name}</p>
                      </div>
                    </DropdownTrigger>
                  </NavbarItem>
                  <DropdownMenu
                    aria-label="ACME features"
                    className="w-[340px]"
                    itemClasses={{
                      base: "gap-4",
                    }}
                  >
                    <DropdownItem key="teamSwitch" textValue="teamSwitch">
                      <Link href="/profile">{t("profile")}</Link>
                    </DropdownItem>
                    <DropdownItem key="logout" textValue="signOut">
                      <Link
                        color="primary"
                        onClick={() => {
                          signOut;
                        }}
                      >
                        {t("signOut")}
                      </Link>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Spacer x={2} />
                <NavbarItem>
                  <ThemeSwitcher />
                </NavbarItem>
                <Dropdown>
                  <DropdownTrigger className="flex items-center">
                    <LanguageIcon className="h-6 w-6" />
                  </DropdownTrigger>
                  <DropdownMenu
                    onAction={(key) => handleLanguageChange(String(key))}
                    aria-label="nav_menu_lang"
                  >
                    <DropdownItem value="en" key="en" aria-label="en">
                      <p>English</p>
                    </DropdownItem>
                    <DropdownItem value="cn" key="cn" aria-label="cn">
                      <p>简体中文</p>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarContent>
            </Navbar>

            {pathname.indexOf("/dashboard/team") >= 0 && (
              <Tabs>
                {menus.team.map((menu) => (
                  <Tab key={menu.key} title={menu.title} href={menu.path} />
                ))}
              </Tabs>
            )}
          </div>
        );
      }}
    </Authenticator>
  );
}
