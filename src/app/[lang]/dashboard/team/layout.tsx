"use client";
import Tabbar from "@/components/Tabbar";
import { pathnames } from "@/config";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { use } from "react";

export default function DashbordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Team");
  const pathName = usePathname();

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <Tabbar
          items={[
            {
              key: "main",
              title: t("menuMain"),
              icon: "team",
              path: "/dashboard/team/main",
            },
            {
              key: "member",
              title: t("menuMember"),
              icon: "settings",
              path: "/dashboard/team/members",
            },
            {
              key: "price",
              title: t("menuSetting"),
              icon: "price",
              path: "/dashboard/team/price",
            },
            {
              key: "profile",
              title: t("menuSetting"),
              icon: "settings",
              path: "/dashboard/team/setting",
            },
          ]}
          activePath={pathName}
        />
      </div>
      <div className="w-full h-full p-4">{children}</div>
    </>
  );
}
