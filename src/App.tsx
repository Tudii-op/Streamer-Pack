import { useEffect, useState } from 'react';
import { loadModules } from './modules-loader';

// Define module interface
export interface Module {
  name: string;
  start: () => Promise<void> | void;
  stop: () => void;
}

// Make state type-safe
export default function App() {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    loadModules().then((loadedModules) => {
      // Type assertion if loader returns unknown
      setModules(loadedModules as Module[]);
    });
  }, []);

  return (
    <div>
      <h1>Modular Engine MVP</h1>
      {modules.map((mod) => (
        <div key={mod.name}>
          <h3>{mod.name}</h3>
          <button onClick={() => mod.start()}>Start</button>
          <button onClick={() => mod.stop()}>Stop</button>
        </div>
      ))}
    </div>
  );
}
