import { useEffect, useState } from "react";
import { listInstalledPackages, loadPlugin } from "./core/moduleLoader";
import { useTabs } from './hook/useTab';
import TabBar from './component/tabs/TabBar';
import SideBar from "./component/layout/SideBar";
import Window from "./component/body/Window";
import DebugPanel from "./component/debug/debugPanel";
import { addLog, subscribeLogs } from "./component/debug/debugLogger";
import Browse from "./component/body/Browse";

export default function App() {
  const [packages, setPackages] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { tabs, activeId, activeTab, openTab, openBrowserTab, closeTab, selectTab, setTabPlugin, BROWSER_TAB_ID } = useTabs();

  useEffect(() => {
    addLog("App: Initializing - listing installed packages");
    listInstalledPackages().then(setPackages);
  }, []);

  useEffect(() => {
    addLog("App: Subscribing to log stream");
    const unsub = subscribeLogs((newLogs) => setLogs([...newLogs]));
    return () => {
      addLog("App: Unsubscribing from log stream");
      unsub();
    };
  }, []);

  const fetchPlugin = async (pkg: string) => {
    addLog(`App: Fetching plugin '${pkg}'`);
    const existing = tabs.find(t => t.id === pkg);
    if (existing?.Plugin) {
      addLog(`App: Plugin '${pkg}' already loaded, opening tab`);
      openTab(pkg);
      return;
    }

    addLog(`App: Opening new plugin tab for '${pkg}'`);
    openTab(pkg);
    setLoading(true);
    try {
      addLog(`App: Loading plugin '${pkg}' from core`);
      const plugin = await loadPlugin(pkg);
      addLog(`App: Plugin '${pkg}' loaded successfully`);
      setTabPlugin(pkg, plugin.default);
    } catch (err) {
      addLog(`App: Failed to load plugin '${pkg}': ${String(err)}`);
      closeTab(pkg);
    } finally {
      addLog(`App: Plugin load complete for '${pkg}'`);
      setLoading(false);
    }
  };

  const isBrowserTab = activeId === BROWSER_TAB_ID;

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-zinc-200 font-mono overflow-hidden">

      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-900 bg-[#0d0d0d] shrink-0">
        <span className="ml-3 text-[11px] tracking-widest text-cyan-300 uppercase">
          MODULAR // {isBrowserTab ? 'browse' : (activeId ?? 'no plugin active')}
        </span>
        {loading && (
          <span className="ml-auto text-[10px] text-cyan-300 tracking-widest animate-pulse">
            ● LOADING
          </span>
        )}
      </div>

      {/* Main layout */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <SideBar
            fetchPlugin={fetchPlugin}
            packages={packages}
            activePlugin={isBrowserTab ? null : activeId}
            setBrowsing={openBrowserTab}
          />
          <div className="flex flex-col flex-1 overflow-hidden">
            <TabBar
              tabs={tabs}
              activeId={activeId}
              onSelect={(id) => {
                addLog(`App: Selecting tab '${id}'`);
                selectTab(id);
              }}
              onClose={(id) => {
                addLog(`App: Closing tab '${id}'`);
                closeTab(id);
              }}
            />
            <div className="flex-1 overflow-hidden">
              {isBrowserTab ? (
                <Browse />
              ) : (
                <Window
                  Plugin={activeTab?.Plugin ?? null}
                  loading={loading && !!activeId && !activeTab?.Plugin}
                />
              )}
            </div>
          </div>
        </div>
        <DebugPanel logs={logs} />
      </div>

    </div>
  );
}

