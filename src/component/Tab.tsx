import type { ReactNode } from "react";

interface TabProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: {
    id: string;
    content: ReactNode;
    label: string;
  }[];
}

export const Tab = ({ activeTab, onTabChange, tabs }: TabProps) => {
  return (
    <div className=" w-full ">
      {/* タブヘッダー */}
      <div className="flex justify-center border-b border-lightGray">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 bg-blue-50 text-blue-600"
                : "text-gray hover:bg-lightGray hover:text-gray"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};
