import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { InstalledPackage } from "../types/maintypes";
import { addLog } from "../debugLogger";

export function useInstalled() {
  const [installed, setInstalled] = useState<InstalledPackage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInstalled = () => {
    setLoading(true);
    addLog("Fetching installed packages...");

    invoke<InstalledPackage[]>("list_installed_packages")
      .then((data) => {
        setInstalled(data);
        addLog(`Loaded ${data.length} installed packages`);
      })
      .catch((err) => {
        addLog("Failed to fetch installed: " + String(err));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInstalled();
  }, []);

  return { installed, loading, refetch: fetchInstalled };
}

