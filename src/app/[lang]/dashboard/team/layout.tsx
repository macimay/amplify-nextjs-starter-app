import { Tabs, Tab } from "@nextui-org/react";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-row w-full h-full">{children}</div>;
}
