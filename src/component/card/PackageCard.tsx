import type { Package } from "../../types/maintypes";

type Props = {
  pkg: Package;
  onInstall: (downloadUrl: string) => void;
};

export default function PackageCard({ pkg, onInstall }: Props) {
  return (
    <div className="p-2 border border-zinc-700 rounded hover:bg-zinc-800 transition">
      <div className="font-bold">{pkg.name}</div>
      <div className="text-sm text-zinc-300">{pkg.description}</div>

      <button
        onClick={() => onInstall(pkg.downloadUrl)}
        className="mt-2 px-2 py-1 border border-cyan-400 rounded hover:bg-cyan-500 hover:text-black transition"
      >
        Install
      </button>
    </div>
  );
}