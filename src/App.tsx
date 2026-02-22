import { useEffect, useState } from "react";
import { loadModules } from "./modules-loader";

export default function App() {
  const [modules, setModules] = useState<string[]>([]);

  useEffect(() => {
    async function init() {
      const loaded = await loadModules();
      setModules(loaded);
    }

    init();
  }, []);

  return (
    <div>
      <h1>Streamer Pack v1</h1>
      {modules.map((m, i) => (
        <p key={i}>{m}</p>
      ))}
    </div>
  );
}

