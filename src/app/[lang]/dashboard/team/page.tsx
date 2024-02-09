"use client";
import { useTranslations } from "next-intl";

export default function DashboardTeamPage() {
  const t = useTranslations("Navigation");
  return <div>Dashboard Team Page {t("team")}</div>;
}
