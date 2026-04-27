import { TabType } from "../../types/tabtypes.ts";
type Props = {
  tabs: TabType[];
  setTabs: React.Dispatch<React.SetStateAction<TabType[]>>;
  activeTabId: string | null;
  setActiveTabId: (id: string) => void;
};

export default function TabLayout({
  tabs,
  setTabs,
  activeTabId,
  setActiveTabId,
}: Props) {

  const addTab = () => {

    const newTab: TabType = {
      id: "tab-" + Date.now(),
      title: "New Tab"
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  return (
    <div>
      {/* Tabs bar */}
      <div className="flex gap-2">
        {tabs.map((tab, index) => (
            <div key={tab.id} className="flex items-center gap-1">
                <button
                onClick={() => setActiveTabId(tab.id)}
                className={`px-3 py-1 rounded ${
                    tab.id === activeTabId
                    ? "bg-zinc-700"
                    : "bg-zinc-800"
                }`}
                >
                {tab.title}
                </button>

                <button
                onClick={() => {
                    setTabs(prev => {
                    const newTabs = prev.filter(t => t.id !== tab.id);

                    // auto switch tab if closing active
                    if (activeTabId === tab.id) {
                        if (newTabs.length > 0) {
                        const nextTab = newTabs[index - 1] || newTabs[0];
                        setActiveTabId(nextTab.id);
                        } else {
                        setActiveTabId("");
                        }
                    }

                    return newTabs;
                    });
                }}
                className="text-red-500"
                >
                ×
                </button>
            </div>
            ))}

        <button
          onClick={addTab}
          className="px-3 py-1 bg-green-600 rounded"
        >
          +
        </button>
      </div>
    </div>
  );
}