type Props = {
  logs: string[];
};

export default function DebugPanel({ logs }: Props) {
  return (
    <div className=" p-2 bg-zinc-800 text-xs text-cyan-300 rounded h-full overflow-auto border-t border-zinc-700">
      <div className="font-bold">Debug Logs:</div>
      {logs.map((msg, idx) => (
        <div key={idx}>{msg}</div>
      ))}
    </div>
  );
}