type Props = {
  fetchPlugin: (pkg: string) => Promise<void>;
  packages: string[];
  activePlugin: string | null;
  setBrowsing: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SideBar({ fetchPlugin, packages, activePlugin, setBrowsing }: Props) {
  return (
    <div className="w-56 shrink-0 border-r border-zinc-900 bg-[#0d0d0d] flex flex-col">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-900">
        <span className="text-[10px] tracking-widest text-cyan-300 uppercase">Packages</span>
      </div>
      <button 
        onClick={() => setBrowsing((prev: boolean) => !prev)}
        className="px-4 py-2.5 text-xs tracking-wide text-cyan-300 hover:bg-zinc-900 hover:text-white border-l-2 border-transparent"
      >
        Browse Packages
      </button>
      {/* Package list */}
      <ul className="flex-1 overflow-y-auto py-2">
        {packages.length === 0 && (
          <li className="px-4 py-3 text-xs text-cyan-300">No packages installed</li>
        )}
        {packages.map((pkg) => (
          <li key={pkg}>
            <button
              onClick={() => fetchPlugin(pkg)}
              className={`w-full text-left px-4 py-2.5 text-xs tracking-wide transition-colors
                ${activePlugin === pkg
                  ? "bg-zinc-800 text-white border-l-2 border-blue-500"
                  : "text-cyan-300 hover:bg-zinc-900 hover:text-white border-l-2 border-transparent"
                }`}
            >
              {pkg}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}