import { SideBarProps } from "../../types/maintypes";
import { usePackages } from "../../hooks/usePackage";
import { usePackageInstaller } from "../../hooks/usePackageInstaller";
import PackageCard from "../card/PackageCard";
import DebugPanel from "../debug/debugPanel";

export function Window({ browse, setBrowse }: SideBarProps) {
  const { packages, loading, debugLogs, log } = usePackages(browse);
  const { installPackage } = usePackageInstaller(log);

  return (
    <div className="flex-1 border border-zinc-700 rounded-lg p-4 ml-3 bg-zinc-900 text-cyan-400 relative flex flex-col">
      {browse && (
        <button
          className="absolute top-2 right-2 px-2 py-1 border border-cyan-400 rounded hover:bg-cyan-500 hover:text-black transition"
          onClick={() => setBrowse(false)}
        >
          X
        </button>
      )}

      <div className="text-lg font-semibold mt-2 flex-1 overflow-auto">
        {browse ? (
          <div className="flex flex-col space-y-3">
            {loading && <div>Loading packages...</div>}

            {!loading && packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onInstall={installPackage}
              />
            ))}
          </div>
        ) : (
          <div>Browsing is OFF</div>
        )}
      </div>

      <DebugPanel logs={debugLogs} />
    </div>
  );
}