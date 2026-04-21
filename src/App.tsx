import SideBar from "./component/layout/SideBar";
import { Window } from "./component/body/Window";
import { useState, useEffect } from "react";
import DebugPanel from "./component/debug/debugPanel";
import { getLogs, subscribeLogs } from "./debugLogger";

export default function App() {
  const [choosenPackage, setChoosenPackage] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>(getLogs());

  useEffect(() => {
    return subscribeLogs(setDebugLogs);
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 p-3 gap-3">
      <SideBar
        setChoosenPackage={setChoosenPackage}
      />
      <div className="flex flex-col w-full gap-3">
        <Window
          choosenPackage={choosenPackage}
        />
        <div className="h-1/5">
          <DebugPanel logs={debugLogs}/>
        </div>
      </div>
    </div>
  );
}