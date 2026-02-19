"use client";

import { useRef, useState } from "react";

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
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // 콘텐츠가 마운트된 후 스크롤 (새 탭 콘텐츠 렌더링 대기)
    setTimeout(() => {
      scrollToTabs();
    }, 50);
  };

  const scrollToTabs = () => {
    if (!tabsRef.current) return;
    const scrollableParent = findScrollableParent(tabsRef.current);
    if (scrollableParent) {
      const headerOffset = 52;
      const tabsRect = tabsRef.current.getBoundingClientRect();
      const parentRect = scrollableParent.getBoundingClientRect();
      const scrollTop = scrollableParent.scrollTop + tabsRect.top - parentRect.top - headerOffset;
      scrollableParent.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  // 스크롤 가능한 부모 요소 찾기
  const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
    let parent = element.parentElement;
    while (parent) {
      const { overflowY } = window.getComputedStyle(parent);
      if (overflowY === "auto" || overflowY === "scroll") {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  };

  return (
    <div ref={tabsRef} className="bg-white rounded-xl scroll-mt-[56px]">
      {/* 탭 헤더 */}
      <div className="flex justify-center border-b border-gray-100 p-0 sticky top-[52px] bg-white z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
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
