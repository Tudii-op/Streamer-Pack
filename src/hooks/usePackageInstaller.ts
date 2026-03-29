import { invoke } from "@tauri-apps/api/core";

export function usePackageInstaller(log: (msg: string) => void) {
  const installPackage = async (downloadUrl: string) => {
    try {
      log("Installing...");
      const res = await invoke("install_package", {
        url: downloadUrl,
      });
      log("Done: " + String(res));
    } catch (e) {
      log("Install error: " + String(e));
    }
  };

  return { installPackage };
}