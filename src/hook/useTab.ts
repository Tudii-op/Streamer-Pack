import { useState, useCallback } from 'react'
import { TabType } from '../types/tabtypes'
import { addLog } from '../component/debug/debugLogger'

export function useTabs() {
  const [tabs, setTabs] = useState<TabType[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // Open or focus a tab. Plugin starts null (loading), gets set later via setTabPlugin
  const openTab = useCallback((pkg: string) => {
    addLog(`useTab: Opening tab '${pkg}'`);
    setTabs(prev => {
      if (prev.find(t => t.id === pkg)) {
        addLog(`useTab: Tab '${pkg}' already exists, not re-creating`);
        return prev
      }
      addLog(`useTab: Creating new tab '${pkg}'`);
      return [...prev, { id: pkg, title: pkg, Plugin: null }]
    })
    addLog(`useTab: Activating tab '${pkg}'`);
    setActiveId(pkg)
  }, [])

  // Called once the plugin finishes loading — caches the component in the tab
  const setTabPlugin = useCallback((pkg: string, Plugin: React.ComponentType) => {
    addLog(`useTab: Setting plugin component for tab '${pkg}'`);
    setTabs(prev => prev.map(t => t.id === pkg ? { ...t, Plugin } : t))
  }, [])

  const closeTab = useCallback((id: string) => {
    addLog(`useTab: Closing tab '${id}'`);
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id)
      setActiveId(cur => {
        if (cur !== id) return cur
        const nextId = next.length ? next[next.length - 1].id : null
        addLog(`useTab: Switched active tab to '${nextId}' after closing`);
        return nextId
      })
      return next
    })
  }, [])

  const selectTab = useCallback((id: string) => {
    addLog(`useTab: Programmatic select tab '${id}'`);
    setActiveId(id)
  }, [])

  const activeTab = tabs.find(t => t.id === activeId) ?? null

  return { tabs, activeId, activeTab, openTab, closeTab, selectTab, setTabPlugin }
}