"use client";
import { useEffect, useState } from "react";
import { fetchPackages, InstallPackage } from "../../core/browseHooks";
import { Package } from "../../types/maintypes";

export default function Browse() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [installing, setInstalling] = useState<string | null>(null);
  const [installed, setInstalled] = useState<string[]>([]);
useEffect(() => {
  fetchPackages().then((data) => setPackages(data ?? []));
}, []);
  async function handleInstall(pkg: string) {
    setInstalling(pkg);
    await InstallPackage(pkg);
    setInstalled((prev) => [...prev, pkg]);
    setInstalling(null);
  }
async function handleRefresh() {
  const pkgs = await fetchPackages();
  setPackages(pkgs);
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
      <div className="flex flex-col gap-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700">
            <div className="flex flex-col">
              <span className="text-white font-medium">{pkg.name}</span>
              {pkg.description && <span className="text-xs text-zinc-400">{pkg.description}</span>}
            </div>
            <button onClick={() => handleInstall(pkg.downloadUrl)}>
              Install
            </button>
          </div>
        ))}      
      </div>
    </div>
  );
}