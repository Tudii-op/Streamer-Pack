// Content.tsx
import { useLayout } from '../layout/MainLayout'

export default function Content() {
  const { selectedTab } = useLayout()
  
  // Now you know which tab is active
  return (
    <div className="h-2/3 bg-neutral-900 p-4 overflow-hidden text-white">
      Content for: {selectedTab}
    </div>
  )
}