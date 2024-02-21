"use client";

import { useTranslations } from "next-intl";

import { Image, Link, NavbarMenu, Select, Spacer } from "@nextui-org/react";

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
import React, { useState } from "react";

import ThemeSwitcher from "./ThemeSwitcher";
import { HeartIcon, HomeModernIcon } from "@heroicons/react/24/outline";

import { LanguageIcon } from "@heroicons/react/16/solid";
import { usePathname, useRouter } from "@/navigation";
import { AuthUser } from "aws-amplify/auth";

export default function NavigationBar({
  signOut,
  user,
}: {
  signOut?: () => void;
  user?: AuthUser;
}) {
  const t = useTranslations("Navigation");
  const [locale, setLocale] = useState("en");

  const router = useRouter();
  const pathname = usePathname();
  console.log("pathname", signOut);

  const handleLanguageChange = (newLocale: string) => {
    console.log("newLocale", newLocale);
    // Fix: Remove the object wrapper around newLocale
    router.push(pathname, { locale: newLocale });
  };
  const handleSignOut = () => {
    console.log("sign out clicked");
    signOut && signOut();
  };

  return (
    <Navbar maxWidth="full">
      <NavbarBrand>
        <Image src="/assets/picture/logo.png" alt="logo" />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem isActive>
          <Button as={Link} href="/dashboard/workspace" color="primary">
            {t("workspace")}
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Link href="/dashboard/team">{t("team")}</Link>
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
                <p>{user?.username}</p>
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
            <DropdownItem key="profile" textValue="profile">
              <Link href="/profile">{t("profile")}</Link>
            </DropdownItem>
            <DropdownItem key="logout" textValue="signout">
              <Link color="primary" onClick={handleSignOut}>
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
  );
}
