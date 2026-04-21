import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { Package } from "../types/maintypes";
import { addLog, getLogs } from "../debugLogger";

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    setLoading(true);
    addLog("Fetching packages via Tauri...");

    invoke<Package[]>("get_packages")
      .then((data) => {
        setPackages(data);
        addLog(`Fetched ${data.length} packages`);
      })
      .catch((err) => {
        addLog("Invoke error: " + String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { packages, loading, debugLogs: getLogs() };
}