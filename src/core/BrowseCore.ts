import { invoke } from "@tauri-apps/api/core";
import { addLog } from "../component/debug/debugLogger";
import { Package } from "../types/maintypes";
const API_BASE_URL = "http://localhost:3000";

export async function fetchPackages(): Promise<Package[]> {
  addLog("Fetching packages...");
  return fetch(`${API_BASE_URL}/api/packages`)
    .then((response) => {
      addLog(`Packages response: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      addLog(`Packages fetched: ${data.length} found`);
      return data as Package[];
    })
    .catch((err) => {
      addLog(`Failed to fetch packages: ${err}`);
      throw err;
    });
}

export async function InstallPackage(downloadUrl: string) {
  addLog(`Installing package: ${downloadUrl}`);
  const fullUrl = `http://localhost:3000${downloadUrl}`;
  
  return invoke("install_package", { url: fullUrl })
    .then((result) => {
      addLog(`Install result: ${result}`);
      return result;
    })
    .catch((err) => {
      addLog(`Failed to install: ${err}`);
      throw err;
    });
}
export async function uninstallPackage(packageName: string) {
  addLog(`Uninstalling package: ${packageName}`);
  return fetch("/api/uninstall", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packageName }),
  })
    .then((response) => {
      addLog(`Uninstall response: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      addLog(`Uninstall result: ${JSON.stringify(data)}`);
      return data;
    })
    .catch((err) => {
      addLog(`Failed to uninstall ${packageName}: ${err}`);
      throw err;
    });
}