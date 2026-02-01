// Container.tsx (your DetailPanel)
import { useLayout } from '../layout/MainLayout'

export default function Container() {
  const { selectedTab } = useLayout()
  
  return (
    <div className="h-1/3 bg-neutral-800 border-l border-neutral-700 p-4">
      Details for: {selectedTab}
    </div>
  )
}