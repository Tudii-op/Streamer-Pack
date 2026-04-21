import { usePackageInstaller } from "../../hooks/usePackageInstaller";
import { addLog } from "../../debugLogger";
import { usePackages } from "../../hooks/usePackage";


export default function Browse() {
  const { installPackage } = usePackageInstaller(addLog);
  const { packages: availablePackages, loading } = usePackages();
  return (
    <div className="space-y-4 p-4">
      <div className="text-2xl font-bold text-cyan-400 mb-2">Browse</div>

      {loading && <div className="text-zinc-400">Loading packages...</div>}

      {!loading &&
        availablePackages.map((pkg) => (
          <div
            key={pkg.id}
            className="w-full text-left p-4 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition cursor-pointer flex flex-col gap-2"
          >
            <div
              className="flex justify-between items-center"
            >
              <div className="font-semibold text-cyan-300 text-lg">{pkg.name}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  installPackage(pkg.downloadUrl);
                }}
                className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded transition"
              >
                Download
              </button>
            </div>
            <div className="text-sm text-zinc-400">{pkg.description}</div>
          </div>
        ))}
    </div>
  );
}