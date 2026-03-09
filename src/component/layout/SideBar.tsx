// SideBar.tsx
import { useLayout } from './MainLayout'
import { useState, useEffect } from "react";
import { loadModules, LoadedModule } from "../../modules-loader";
import { invoke } from "@tauri-apps/api/core";

export default function SideBar() {
  const { selectedTab, setSelectedTab } = useLayout()
  
  const tabs = ['captures', 'media', 'stream', 'installed modules']
    const [modules, setModules] = useState<LoadedModule[]>([]);

  useEffect(() => {
    async function init() {
      const loaded = await loadModules();
      setModules(loaded);
    }
    init();
  }, []);

  const installModule = async () => {
    await invoke("install_instances");
    const loaded = await loadModules();
    setModules(loaded);
    alert("Modules installed!");
  };

  return (
    <div className="w-[20%] bg-neutral-900 border-r border-neutral-800 flex flex-col items-center py-4 gap-2">
<button className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium py-2 w-full rounded transition-colors"
          onClick={installModule}
>
  +
</button>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`w-full h-12 rounded capitalize ${
            selectedTab === tab ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-800'
          }`}
        >
          {tab}
        </button>
      ))}
      <div className="max-w-2xl mx-auto">
        <div className=" border">
        {modules.map((mod, i) => (
          <div key={i} className="mt-4 p-2 bg-zinc-800 rounded">
            <h2 className="font-bold">{mod.name}</h2>
            <mod.Component />
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}