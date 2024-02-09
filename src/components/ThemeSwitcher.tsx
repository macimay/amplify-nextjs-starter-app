"use client";

import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LightBulbIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Button isIconOnly onClick={() => setTheme("light")}>
        <LightBulbIcon width={16} />
      </Button>
      <Button isIconOnly onClick={() => setTheme("dark")}>
        <MoonIcon width={16} />
      </Button>
    </div>
  );
}
