import { useEffect, useState } from "react";
import { listInstalledPackages, loadPlugin } from "./hooks/moduleLoader";

import SideBar from "./component/layout/SideBar";
import Window from "./component/body/Window";
import DebugPanel from "./component/debug/debugPanel";
import { addLog } from "./component/debug/debugLogger";

export default function App() {
  const [Plugin, setPlugin] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<string[]>([]);
  const [activePlugin, setActivePlugin] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      const pkgs = await listInstalledPackages();
      setPackages(pkgs);
    };
    fetchPackages();
  }, []);

  const fetchPlugin = async (pkg: string) => {
    try {
      setLoading(true);
      setActivePlugin(pkg);
      const plugin = await loadPlugin(pkg);
      setPlugin(() => plugin.default);
    } catch (err) {
      addLog(String(err));
      setActivePlugin(null);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex flex-col h-screen bg-[#0a0a0a] text-zinc-200 font-mono overflow-hidden text-cyan-300">
  
  {/* Top bar */}
  <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-900 bg-[#0d0d0d] shrink-0">
    <span className="ml-3 text-[11px] tracking-widest text-cyan-300 uppercase">
      MODULAR // {activePlugin ?? "no plugin active"}
    </span>
    {loading && (
      <span className="ml-auto text-[10px] text-cyan-300 tracking-widest animate-pulse">
        ● LOADING
      </span>
    )}
  </div>

  {/* Main layout */}
  <div className="flex flex-1 overflow-hidden">
    
    {/* Sidebar — 20% width, full height */}
    <div className="w-[20%] h-full border-r border-zinc-900">
      <SideBar fetchPlugin={fetchPlugin} packages={packages} activePlugin={activePlugin} />
    </div>

    {/* Right side — 80% width, split into window + debug */}
    <div className="w-[80%] flex flex-col">
      
      {/* Window — 70% height */}
      <div className="h-[70%] overflow-auto">
        <Window Plugin={Plugin} loading={loading} />
      </div>

      {/* Debug panel — 30% height */}
      <div className="h-[30%] border-t border-zinc-900 overflow-auto">
        <DebugPanel logs={[]} />
      </div>

    </div>
  </div>
</div>
  );
}