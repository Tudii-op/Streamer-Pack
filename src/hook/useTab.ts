import { useState, useCallback } from 'react'
import { TabType } from '../types/tabtypes'
import { addLog } from '../component/debug/debugLogger'

const BROWSER_TAB_ID = '__browser__'

export function useTabs() {
  const [tabs, setTabs] = useState<TabType[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // Open or focus a plugin tab
  const openTab = useCallback((pkg: string) => {
    addLog(`useTab: Opening plugin tab '${pkg}'`);
    setTabs(prev => {
      if (prev.find(t => t.id === pkg)) {
        addLog(`useTab: Tab '${pkg}' already exists, not re-creating`);
        return prev
      }
      addLog(`useTab: Creating new plugin tab '${pkg}'`);
      return [...prev, { id: pkg, title: pkg, type: 'plugin', Plugin: null }]
    })
    addLog(`useTab: Activating tab '${pkg}'`);
    setActiveId(pkg)
  }, [])

  // Open a browser tab
  const openBrowserTab = useCallback(() => {
    addLog(`useTab: Opening browser tab`);
    setTabs(prev => {
      if (prev.find(t => t.id === BROWSER_TAB_ID)) {
        addLog(`useTab: Browser tab already exists`);
        return prev
      }
      addLog(`useTab: Creating browser tab`);
      return [...prev, { id: BROWSER_TAB_ID, title: 'Browse', type: 'browser', Plugin: null }]
    })
    addLog(`useTab: Activating browser tab`);
    setActiveId(BROWSER_TAB_ID)
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

  return { tabs, activeId, activeTab, openTab, openBrowserTab, closeTab, selectTab, setTabPlugin, BROWSER_TAB_ID }
}
