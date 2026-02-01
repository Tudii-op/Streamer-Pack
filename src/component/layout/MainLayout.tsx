// Layout.tsx
import { useState, createContext, useContext } from 'react'
import SideBar from './SideBar'

interface LayoutContextType {
  selectedTab: string
  setSelectedTab: (tab: string) => void
}

export const LayoutContext = createContext<LayoutContextType>({
  selectedTab: 'captures',
  setSelectedTab: () => {}
})

export const useLayout = () => useContext(LayoutContext)

export default function Layout({ children }: { children: React.ReactNode }) {
  const [selectedTab, setSelectedTab] = useState('captures')

  return (
    <LayoutContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className="flex h-screen w-screen overflow-hidden bg-neutral-950">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </LayoutContext.Provider>
  )
}