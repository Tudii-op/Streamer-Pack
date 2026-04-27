import { invoke } from "@tauri-apps/api/core";

export async function loadPlugin(pluginName: string) {
  const code: string = await invoke("load_plugin", { pluginName });

  try {
    // Try blob URL first (works in dev)
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);

    try {
      const module = await import(/* @vite-ignore */ url);
      URL.revokeObjectURL(url);
      return module;
    } catch {
      URL.revokeObjectURL(url);
      throw new Error("blob import failed");
    }

  } catch {
    // Fallback: execute via Function for production
    const exports: Record<string, unknown> = {};
    const fn = new Function("exports", code + "\nexports.default = typeof s !== 'undefined' ? s : undefined;");
    fn(exports);
    return exports;
  }
}

export async function listInstalledPackages() {
  return invoke<string[]>("list_installed_packages");
}