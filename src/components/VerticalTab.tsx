// types.ts
import { Button, Listbox, ListboxItem } from "@nextui-org/react";
import React, { Key, useState } from "react";
export interface Tab {
  key: string;
  title: string;
  content: string;
}

// components/VerticalTabs.tsx

export default function VerticalTabs({
  tabs,
  callback,
}: {
  tabs: Tab[];
  callback: (key: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<Key>(tabs[0].key);

  return (
    <div className="flex flex-col">
      <Listbox
        onAction={(key) => {
          console.log("key:", key);
          setActiveTab(key.toString());
          callback(key.toString());
        }}
        aria-label="Vertical Tabs"
      >
        {tabs.map((tab) => (
          <ListboxItem
            key={tab.key}
            aria-label={tab.title}
            startContent={
              <div
                className={
                  "w-[2px] h-5" + (activeTab == tab.key && " bg-blue-500")
                }
              />
            }
          >
            {tab.title}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
}
