"use client";

export interface PillTab {
  id: string;
  label: string;
  hasDividerAfter?: boolean; // 이 탭 뒤에 구분선 표시
}

export interface PillTabsProps {
  tabs: PillTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function PillTabs({ tabs, activeTab, onChange }: PillTabsProps) {
  return (
    <div className="flex items-center mr-[10px]">
      {tabs.map((tab) => (
        <div key={tab.id} className={`flex items-center gap-2 ${tab.hasDividerAfter ? "mr-[0px]" : "mr-[4px]"}`}>
          <button
            type="button"
            onClick={() => onChange(tab.id)}
            className={`px-[12px] py-[6px] rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary-50 border border-primary-100 text-primary"
                : "bg-white border border-gray-100 text-gray-900"
            }`}
          >
            {tab.label}
          </button>
          {tab.hasDividerAfter && <div className="mr-[10px] w-[1px] h-[12px] bg-gray-100" />}
        </div>
      ))}
    </div>
  );
}
