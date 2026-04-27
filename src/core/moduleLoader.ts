import { invoke } from "@tauri-apps/api/core";
import * as React from "react";
import * as ReactJSXRuntime from "react/jsx-runtime";

export async function loadPlugin(pluginName: string) {
  const code: string = await invoke("load_plugin", { pluginName });

  (window as any).React = React;
  (window as any).__jsx = ReactJSXRuntime;
  (window as any).__tauriCore = { invoke };

  const patchedCode = code
    .replace(
      /import\s*\{([^}]+)\}\s*from\s*["']react\/jsx-runtime["']/g,
      (_, imports) => imports.split(',').map((i: string) => {
        const parts = i.trim().split(/\s+as\s+/);
        return parts.length > 1
          ? `var ${parts[1].trim()} = window.__jsx.${parts[0].trim()};`
          : `var ${parts[0].trim()} = window.__jsx.${parts[0].trim()};`;
      }).join('\n')
    )
    .replace(
      /import\s*(\w+)\s*from\s*["']react["']/g,
      'var $1 = window.React;'
    )
    .replace(
      /import\s*\*\s*as\s*(\w+)\s*from\s*["']react["']/g,
      'var $1 = window.React;'
    )
    .replace(
      /import\s*\{([^}]+)\}\s*from\s*["']@tauri-apps\/api\/core["']/g,
      (_, imports) => imports.split(',').map((i: string) => {
        const parts = i.trim().split(/\s+as\s+/);
        return parts.length > 1
          ? `var ${parts[1].trim()} = window.__tauriCore.${parts[0].trim()};`
          : `var ${parts[0].trim()} = window.__tauriCore.${parts[0].trim()};`;
      }).join('\n')
    )
    .replace(
      /import\s*\*\s*as\s*(\w+)\s*from\s*["']@tauri-apps\/api\/core["']/g,
      'var $1 = window.__tauriCore;'
    )
    .replace(
      /export\s*\{\s*(\w+)\s*as\s*default\s*\}/g,
      'window.__pluginDefault = $1;'
    )
    .replace(
      /export\s*default\s*(\w+)/g,
      'window.__pluginDefault = $1;'
    );

  console.log("PATCHED CODE:", patchedCode);

  const blob = new Blob([patchedCode], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const script = document.createElement("script");
  script.type = "module";
  script.src = url;
  document.head.appendChild(script);

  await new Promise((res) => script.onload = res);
  URL.revokeObjectURL(url);

  return { default: (window as any).__pluginDefault };
}

export async function listInstalledPackages() {
  return invoke<string[]>("list_installed_packages");
}