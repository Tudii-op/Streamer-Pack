import { invoke } from "@tauri-apps/api/core";

export function usePackageInstaller(log: (msg: string) => void) {
  const installPackage = async (downloadUrl: string) => {
    if (!downloadUrl) {
      log("❌ No download URL provided");
      return;
    }

    try {
      log("Installing...");

      const res = await invoke<string>("install_package", {
        url: downloadUrl,
      });

      log("✅ Done: " + res);

      return true; // success
    } catch (e) {
      log("❌ Install error: " + String(e));
      return false; // failure
    }
  };

  return { installPackage };
}