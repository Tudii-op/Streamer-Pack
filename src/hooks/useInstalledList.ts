import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { InstalledPackage } from "../types/maintypes";

export function useInstalled() {
  const [installed, setInstalled] = useState<InstalledPackage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInstalled = () => {
    setLoading(true);

    invoke<InstalledPackage[]>("list_installed_packages")
      .then(setInstalled)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInstalled();
  }, []);

  return { installed, loading, refetch: fetchInstalled };
}

