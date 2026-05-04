export default function Window({ 
  Plugin, 
  loading,
}: { 
  Plugin: React.ComponentType | null, 
  loading: boolean,
}) {

  return (
    <div className="flex-1 bg-[#0a0a0a] overflow-auto p-6">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <span className="text-xs text-zinc-500 tracking-widest animate-pulse uppercase">
            Loading plugin...

            <img src="/loading.svg" alt="Loading" className="inline-block w-4 h-4 ml-2" />
          </span>
        </div>
      ) : Plugin ? (
        <Plugin />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <span className="text-zinc-200 text-xs tracking-widest uppercase">No plugin loaded</span>
          <span className="text-zinc-200 text-[10px]">Select a package from the sidebar</span>
          <img src="/loading.svg" alt="Loading" />
        </div>
      )}
    </div>
  );
}