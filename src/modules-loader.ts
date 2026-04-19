import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { addLog } from "./debugLogger";

export type LoadedModule = {
  name: string;
  Component: React.ComponentType;
};

export async function loadModules(): Promise<LoadedModule[]> {
  const modules: LoadedModule[] = [];

  addLog("Loading modules...");

  const files = import.meta.glob("../modules/*/index.tsx");
  for (const path in files) {
    const mod: any = await files[path]();
    const folderName = path.split("/")[path.split("/").length - 2] ?? "Unknown Module";
    modules.push({
      name: folderName,
      Component: mod.default,
    });
  }

  addLog(`Loaded ${Object.keys(files).length} local modules`);

  const installedPaths: string[] = await invoke("list_installed_modules");
  addLog(`Found ${installedPaths.length} installed modules`);

  for (const path of installedPaths) {
    try {
      const mod: any = await import(`../instances/${path.split("/").pop()}/index.tsx`);
      modules.push({
        name: path.split("/").pop() ?? "Unknown Module",
        Component: mod.default,
      });
    } catch {
      addLog(`Failed to load module at ${path}`);
    }
  }

  addLog(`Total modules loaded: ${modules.length}`);
  return modules;
}