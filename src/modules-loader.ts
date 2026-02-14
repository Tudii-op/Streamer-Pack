import type { Module } from './App';

export async function loadModules(): Promise<Module[]> {
  // import.meta.glob returns: Record<string, () => Promise<unknown>>
  const modulesContext: Record<string, () => Promise<any>> = import.meta.glob('../modules/*/index.js');

  const loadedModules: Module[] = [];

  for (const path in modulesContext) {
    const moduleImport = await modulesContext[path]();
    // Type assertion here
    const mod = moduleImport.default as Module || moduleImport as Module;
    loadedModules.push(mod);
  }

  return loadedModules;
}
