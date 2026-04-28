
export default function Tab(tab: string | null) {
  return (
    <div> 
      <span className="text-sm text-zinc-400">{tab ?? "No tab selected"}</span>
    </div>
  )
}