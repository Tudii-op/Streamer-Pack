import { useState, useEffect } from "react";
import { loadModules, LoadedModule } from "./modules-loader";
import { invoke } from "@tauri-apps/api/core";

export default function App() {
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 tracking-tight">
          Streamer Pack v1
        </h1>
        <button
          className="bg-zinc-700 px-4 py-2 rounded mr-2 hover:bg-zinc-600"
          onClick={installModule}
        >
          Install +1
        </button>
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
  );
}