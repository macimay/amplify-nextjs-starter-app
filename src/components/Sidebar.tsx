"use client";
// src/components/Sidebar.tsx
import React, { useState } from "react";
import {
  Button,
  Spacer,
  Image,
  Link,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { HomeModernIcon } from "@heroicons/react/16/solid";
import type { ReactNode, SVGProps } from "react";
import { useRouter } from "next/navigation";

// src/types/menuItem.ts
export interface MenuItem {
  label: string;
  icon: string; // This can be the name of the icon if using a text-based icon library
  path: string;
}

export default function Sidebar({ items }: { items: MenuItem[] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const router = useRouter();
  console.log("")
  return (
    <div
      style={{
        width: isExpanded ? "200px" : "50px",
        minHeight: "100vh",

        transition: "width 0.3s",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Spacer y={1} />
      <div>
        <Listbox onChange={() => {}} aria-label="sidebar control">
          {items.map((item, index) => (
            <ListboxItem key={item.path} textValue={item.label}>
              <div className="flex flex-row">
                <Image
                  src={item.icon}
                  width={24}
                  height={24}
                  alt={item.label}
                />
                {isExpanded && <Link href={item.path}>{item.label}</Link>}
              </div>
            </ListboxItem>
          ))}
        </Listbox>
      </div>
    </div>
  );
}
