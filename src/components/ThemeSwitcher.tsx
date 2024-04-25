"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LightBulbIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import Link from "next/link";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-row gap-4">
      <Button variant="outline" onClick={() => setTheme("light")} size="icon">
        <LightBulbIcon width={16} />
      </Button>
      <Button variant="outline" onClick={() => setTheme("dark")} size="icon">
        <MoonIcon width={16} />
      </Button>
    </div>
  );
}
