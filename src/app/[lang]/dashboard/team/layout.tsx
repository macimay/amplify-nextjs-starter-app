import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Team");
  return (
    <div className="flex flex-col w-full h-full">
      <div id="tabs" className="flex flex-row w-2/3 justify-between">
        <Link href="/dashboard/team">{t("tabIndex")}</Link>
        <Link href="/dashboard/team/members">{t("tabMember")}</Link>
        <Link href="/dashboard/team/settings">{t("tabSetting")}</Link>
      </div>
      <Separator className="my-4" />
      {children}
    </div>
  );
}
