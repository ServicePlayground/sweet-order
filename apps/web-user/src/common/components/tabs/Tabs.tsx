"use client";

import { useState } from "react";

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || "");

  return (
    <div className="bg-white rounded-xl">
      {/* 탭 헤더 */}
      <div className="flex justify-center border-b border-gray-100 p-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 h-[44px] flex items-center justify-center text-sm border-0 bg-transparent cursor-pointer transition-all duration-200"
          >
            <span
              className={`h-full flex items-center justify-center ${activeTab === tab.id ? "font-bold text-gray-900 border-b-2 border-gray-900" : "font-medium text-gray-500 border-b-2 border-transparent"}`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="py-[24px] px-[20px]">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  );
}
