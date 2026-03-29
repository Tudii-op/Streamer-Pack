import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { Package } from "../types/maintypes";

export function usePackages(browse: boolean) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const log = (msg: string) => {
    setDebugLogs((prev) => [...prev, msg]);
  };

  useEffect(() => {
    if (!browse) return;

    setLoading(true);
    log("Fetching packages via Tauri...");

    invoke<Package[]>("get_packages")
      .then((data) => {
        setPackages(data);
        log(`Fetched ${data.length} packages`);
      })
      .catch((err) => {
        log("Invoke error: " + String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [browse]);

  return { packages, loading, debugLogs, log };
}