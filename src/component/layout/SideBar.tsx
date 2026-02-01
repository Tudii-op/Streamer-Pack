// SideBar.tsx
import { useLayout } from './MainLayout'

export default function SideBar() {
  const { selectedTab, setSelectedTab } = useLayout()
  
  const tabs = ['captures', 'media', 'stream']
  
  return (
    <div className="w-16 bg-neutral-900 border-r border-neutral-800 flex flex-col items-center py-4 gap-2">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`w-12 h-12 rounded capitalize ${
            selectedTab === tab ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-800'
          }`}
        >
          {tab[0]}
        </button>
      ))}
    </div>
  )
}