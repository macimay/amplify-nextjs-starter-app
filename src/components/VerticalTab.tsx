// types.ts

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
      \
      {tabs.map((tab) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          key={tab.key}
          aria-label={tab.title}
          onClick={() => {
            setActiveTab(tab.key);
            callback(tab.key);
          }}
        >
          {activeTab == tab.key && (
            <div
              className={
                "w-[2px] h-5" + (activeTab == tab.key && " bg-blue-500")
              }
            />
          )}
          {tab.title}
        </div>
      ))}
    </div>
  );
}
