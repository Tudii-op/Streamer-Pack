export async function fetchPackages() {
  return fetch("/api/packages")
    .then((response) => response.json())
    .then((data) => data.packages as string[]);
}
export async function InstallPackage(packageName: string) {
  return fetch("/api/install", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ packageName }),
  }).then((response) => response.json());
}
export async function uninstallPackage(packageName: string) {
  return fetch("/api/uninstall", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ packageName }),
  }).then((response) => response.json());
}
