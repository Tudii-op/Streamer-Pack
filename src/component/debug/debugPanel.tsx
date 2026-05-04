type Props = {
  logs: string[];
};

export default function DebugPanel({ logs }: Props) {
  return (
    <div className="h-48 min-h-[6rem] border-t border-zinc-800 bg-[#080808] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-[#0a0a0a] shrink-0">
        <span className="text-[10px] tracking-widest text-violet-400 uppercase font-bold">Debug Console</span>
        <span className="text-[9px] text-zinc-600">{logs.length} logs</span>
      </div>
      <div className="flex-1 overflow-auto p-2 bg-[#080808] text-[10px] text-cyan-300/80 font-mono space-y-0.5">
        {logs.length === 0 && (
          <div className="text-zinc-600 py-2">No activity logged</div>
        )}
        {logs.map((msg, idx) => (
          <div key={idx} className="whitespace-pre-wrap break-all">{msg}</div>
        ))}
      </div>
    </div>
  );
}