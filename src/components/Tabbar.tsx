"use client";
import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { MenuItem } from "./Sidebar";
export default function Tabbar({
  items,
  activePath,
}: {
  items: MenuItem[];
  activePath: string;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <Tabs
        variant="underlined"
        aria-label="Tabs variants"
        selectedKey={activePath}
      >
        {items.map((item) => (
          <Tab key={item.path} title={item.label} href={item.path} />
        ))}
      </Tabs>
    </div>
  );
}
