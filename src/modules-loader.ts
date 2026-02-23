import React from "react";
import { invoke } from "@tauri-apps/api/core";

export type LoadedModule = {
  name: string;
  Component: React.ComponentType;
};

export async function loadModules(): Promise<LoadedModule[]> {
  const modules: LoadedModule[] = [];

  // 1️⃣ Load local dev modules
  const files = import.meta.glob("../modules/*/index.tsx");
  for (const path in files) {
    const mod: any = await files[path]();
    const folderName = path.split("/")[path.split("/").length - 2] ?? "Unknown Module";
    modules.push({
      name: folderName,
      Component: mod.default,
    });
  }

  // 2️⃣ Load AppData-installed modules
  const installedPaths: string[] = await invoke("list_installed_modules");

  for (const path of installedPaths) {
    // Dynamically import using relative path trick:
    // Copy AppData modules to a temporary known folder in your project, e.g., src/instances/
    // For demo, assume you copy them after install, otherwise cannot import .tsx directly
    try {
      const mod: any = await import(`../instances/${path.split("/").pop()}/index.tsx`);
      modules.push({
        name: path.split("/").pop() ?? "Unknown Module",
        Component: mod.default,
      });
    } catch {
      console.warn(`Failed to load module at ${path}`);
    }
  }

  return modules;
}