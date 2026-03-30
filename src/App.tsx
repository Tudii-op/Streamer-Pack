import SideBar from "./component/layout/SideBar";
import { Window } from "./component/body/Window";
import { useState } from "react";
import { useInstalled } from "./hooks/useInstalledList";
import DebugPanel from "./component/debug/debugPanel";
import { usePackages } from "./hooks/usePackage";

export default function App() {
  const [browse, setBrowse] = useState(false);
  const [choosenPackage, setChoosenPackage] = useState<string | null>(null);
  const installedState = useInstalled();
  const { debugLogs } = usePackages(browse);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 p-3 gap-3">
      <SideBar
        browse={browse}
        setBrowse={setBrowse}
        installedState={installedState}
        setChoosenPackage={setChoosenPackage}
      />
      <div className="flex flex-col w-full gap-3">
        <Window
          browse={browse}
          setBrowse={setBrowse}
          choosenPackage={choosenPackage}
          setChoosenPackage={setChoosenPackage}

        />
        <div className="h-1/5">
          <DebugPanel logs={debugLogs}/>
        </div>
      </div>
    </div>
  );
}