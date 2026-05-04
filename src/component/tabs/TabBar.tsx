import { TabType } from '../../types/tabtypes.ts';
import { addLog } from '../debug/debugLogger';

interface TabBarProps {
  tabs: TabType[]
  activeId: string | null
  onSelect: (id: string) => void
  onClose: (id: string) => void
}

export default function TabBar({ tabs, activeId, onSelect, onClose }: TabBarProps) {
  return (
    <div className="flex items-stretch border-b border-white/10 bg-neutral-900 h-9 overflow-x-auto overflow-y-hidden">
      {tabs.map(tab => (
        <div
          key={tab.id}
          onClick={() => {
            addLog(`TabBar: Selected tab '${tab.id}'`);
            onSelect(tab.id);
          }}
          className={`
            flex items-center gap-1.5 px-3 text-xs border-r border-white/10
            cursor-pointer whitespace-nowrap min-w-[100px] relative select-none
            transition-colors duration-100
            ${tab.id === activeId
              ? 'bg-neutral-800 text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-violet-500'
              : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}
          `}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
          <span className="flex-1 overflow-hidden text-ellipsis">{tab.title}</span>
          <span
            onClick={e => { 
              e.stopPropagation(); 
              addLog(`TabBar: Closed tab '${tab.id}'`);
              onClose(tab.id); 
            }}
            className="w-4 h-4 flex items-center justify-center rounded text-neutral-500
                       hover:bg-white/10 hover:text-white text-base leading-none"
          >×</span>
        </div>
      ))}
    </div>
  )
}