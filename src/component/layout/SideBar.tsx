// SideBar.tsx
import { useLayout } from './MainLayout'

export default function SideBar() {
  const { selectedTab, setSelectedTab } = useLayout()
  
  const tabs = ['captures', 'media', 'stream']
  
  return (
    <div className="w-[10%] bg-neutral-900 border-r border-neutral-800 flex flex-col items-center py-4 gap-2">
<button className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium py-2 w-full rounded transition-colors">
  +
</button>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`w-full h-12 rounded capitalize ${
            selectedTab === tab ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-800'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}