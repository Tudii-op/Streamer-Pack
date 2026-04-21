import { UseInstalledReturn } from "../../types/maintypes";

type Props = {
  browse: boolean;
  setBrowse: (v: boolean) => void;
  installedState: UseInstalledReturn;
  setChoosenPackage: (id: string) => void;
};

export default function SideBar({
  browse,
  setBrowse,
  installedState,
  setChoosenPackage,
}: Props) {
  const { installed, loading } = installedState;

  return (
    <div className="w-64 border border-zinc-800 rounded-lg p-4 bg-zinc-900">
      <button
        className="w-full mb-4 p-2 border border-cyan-400 rounded hover:bg-cyan-500 hover:text-black"
        onClick={() => setBrowse(!browse)}
      >
        Browse
      </button>

      <div className="text-sm">
        <div className="mb-2 flex items-center justify-between text-cyan-400 font-semibold">
          Installed
          <button
            className="px-2 py-1 border border-cyan-400 rounded hover:bg-cyan-500 hover:text-black text-xs"
            onClick={() => installedState.refetch()}
          >
            Refresh
          </button>
        </div>

        {loading && <div>Loading...</div>}

        {installed.map((pkg) => (
          <div
            key={pkg.name}
            onClick={() => {setChoosenPackage(pkg.name);
                setBrowse(false);}
            }
            className="p-2 border border-zinc-800 rounded mb-2 hover:bg-zinc-800 cursor-pointer"
          >
            {pkg.name}
          </div>
        ))}
      </div>
    </div>
  );
}