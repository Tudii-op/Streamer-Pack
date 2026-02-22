export async function loadModules() {
  const modules = import.meta.glob("../modules/*/index.ts");

  const results: string[] = [];

  for (const path in modules) {
    const mod: any = await modules[path]();
    if (mod.register) {
      const result = mod.register();
      results.push(result);
    }
  }

  return results;
}