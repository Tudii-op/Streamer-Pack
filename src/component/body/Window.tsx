import { useEffect } from "react";
import { usePackages } from "../../hooks/usePackage";
import Browse from "./Browse";

type Props = {
  browse: boolean;
  setBrowse: (v: boolean) => void;
  choosenPackage: string | null;
  setChoosenPackage: (id: string | null) => void;
};

export function Window({
  browse,
  setBrowse,
  choosenPackage,
  setChoosenPackage,
}: Props) {
  const { packages, loading } = usePackages(browse);

  useEffect(() => {
    if (!browse) {
      setChoosenPackage(null);
    }
  }, [browse, setChoosenPackage]);

  return (
    <div className="flex-1 border border-zinc-800 rounded-lg p-4 bg-zinc-900 relative flex flex-col">
      {browse && (
        <button
          className="absolute top-3 right-3 text-zinc-400 hover:text-white"
          onClick={() => setBrowse(false)}
        >
          ✕
        </button>
      )}

      {!browse && !choosenPackage && (
        <div className="text-zinc-500">Select Browse or a package.</div>
      )}

      {browse && !choosenPackage && (
        <Browse
          packages={packages}
          loading={loading}
          onChoose={setChoosenPackage}
        />
      )}

      {!browse && choosenPackage && (
        <div className="text-cyan-300">
          <div className="text-xl font-semibold">Selected package</div>
          <div className="mt-2">{choosenPackage}</div>
          <button
            className="mt-4 px-3 py-1 border border-cyan-400 rounded hover:bg-cyan-500 hover:text-black"
            onClick={() => setChoosenPackage(null)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}