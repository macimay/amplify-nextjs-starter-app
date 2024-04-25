"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <Tabs aria-label="Tabs variants" defaultValue={activePath}>
        <TabsList>
          {items.map((item) => (
            <TabsTrigger value={item.path}> {item.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
