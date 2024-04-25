"use client";
// src/components/Sidebar.tsx
import React, { useState } from "react";

import { HomeModernIcon } from "@heroicons/react/16/solid";
import type { ReactNode, SVGProps } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import Link from "next/link";
import Image from "next/image";

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
  console.log("");
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
      <Separator className="my-1" />
      <div>
        <div onChange={() => {}} aria-label="sidebar control">
          {items.map((item, index) => (
            <div key={item.path}>
              <div className="flex flex-row">
                <Image
                  src={item.icon}
                  width={24}
                  height={24}
                  alt={item.label}
                />
                {item.label}
                {isExpanded && <Link href={item.path}>{item.label}</Link>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
