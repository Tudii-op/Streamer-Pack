"use client";
import { useEffect, useState } from "react";
import { fetchPackages, InstallPackage } from "../../core/BrowseCore";
import { Package } from "../../types/maintypes";
import { addLog } from "../debug/debugLogger";

export default function Browse() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [installing, setInstalling] = useState<string | null>(null);
  const [installed, setInstalled] = useState<string[]>([]);

  useEffect(() => {
    addLog("Browse: Initializing package fetch");
    fetchPackages().then((data) => {
      setPackages(data ?? []);
      addLog(`Browse: Loaded ${data?.length ?? 0} packages`);
    });
  }, []);

  async function handleInstall(pkg: string) {
    addLog(`Browse: Initiating install for '${pkg}'`);
    setInstalling(pkg);
    await InstallPackage(pkg);
    setInstalled((prev) => [...prev, pkg]);
    setInstalling(null);
    addLog(`Browse: Install completed for '${pkg}'`);
  }

  async function handleRefresh() {
    addLog("Browse: Refreshing package list");
    const pkgs = await fetchPackages();
    setPackages(pkgs);
    addLog(`Browse: Refreshed - ${pkgs.length} packages available`);
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Browse Packages</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all
            border border-cyan-500 text-cyan-300 hover:bg-zinc-900
            active:scale-95"
        >
          Refresh
        </button>
      </div>

      {installing && (
        <div className="flex items-center gap-2 text-sm text-cyan-300">
          <span>Installing {installing}...</span>
          <img src="/loading.svg" alt="Loading" className="w-4 h-4" />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700"
          >
            <div className="flex flex-col">
              <span className="text-white font-medium">{pkg.name}</span>
              {pkg.description && (
                <span className="text-xs text-zinc-400">{pkg.description}</span>
              )}
            </div>
            {installed.includes(pkg.id) ? (
              <span className="text-green-500 text-sm font-semibold">Installed</span>
            ) : (
              <button
                onClick={() => handleInstall(pkg.downloadUrl)}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all
                  border border-cyan-500 text-cyan-300 hover:bg-zinc-900 active:scale-95"
              >
                Install
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}