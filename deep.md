# Streamer Pack v1 — System Architecture Deep Documentation

**Generated**: 2026-04-27  
**Version**: 0.1.0  
**Platform**: Cross-platform desktop (Tauri 2 + React 19)

---

## Overview

**Streamer Pack** is a modular desktop application built with Tauri 2 and React 19 that enables users to discover, install, and run portable "plugin" packages. Each plugin is a self-contained JavaScript module (`.index.mjs`) packaged with an optional native DLL, delivered as a ZIP file from a remote package registry. The application provides a unified interface for browsing available packages, installing them locally, and dynamically loading them at runtime without requiring app restarts or rebuilds.

### Core Architecture: Three-Layer Design

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| **Frontend** | React 19 + Vite 7 + Tailwind CSS | UI, plugin runtime, JS module patching |
| **Bridge** | Tauri 2 + Rust (WASM-capable) | Native filesystem, HTTP, DLL interop |
| **Backend** | Remote HTTP API + ZIP packages | Package registry, distribution, metadata |

---

## System Components

### 1. Frontend (src/)

#### 1.1 Application Shell (`App.tsx`)
- **Layout**: Split-pane design — 20% sidebar, 80% main area
- **Main area split**: 70% plugin window / 30% debug panel (fixed proportions)
- **State management**: Local React state (no external store library)
- **Key state**: `Plugin` (component), `packages` (installed list), `activePlugin`, `logs`, `browsing`

#### 1.2 Sidebar (`SideBar.tsx`)
- Displays installed packages from `list_installed_packages`
- "Browse Packages" button toggles browsing mode
- Click-to-load plugin flow with active-state highlighting

#### 1.3 Window Container (`Window.tsx`)
- Conditional rendering: Browse mode vs Plugin mode vs Empty state
- Loading spinner during dynamic import
- Sandbox-like container for plugin execution

#### 1.4 Browser (`Browse.tsx`)
- Fetches available packages from `http://localhost:3000/api/packages`
- Install button triggers Tauri `install_package` command
- Refresh capability for registry changes

#### 1.5 Module Loader (`moduleLoader.ts`)
**The heart of dynamic loading** — performs code transformation:

```typescript
// Transforms ES module imports into global references:
// import React from 'react'        → var React = window.React;
// import {useState} from 'react/jsx-runtime' → var useState = window.__jsx.useState;
// import {invoke} from '@tauri-apps/api/core' → var invoke = window.__tauriCore.invoke;
```

**Process flow**:
1. Fetch plugin source via `invoke("load_plugin", {pluginName})`
2. Apply regex-based import rewriting (5 transformation rules)
3. Create Blob URL from transformed code
4. Inject as `<script type="module">` into DOM
5. Wait for `onload`, then extract `window.__pluginDefault`
6. Return as React component

**Security note**: No eval/Function constructor — uses native `<script>` module loading.

#### 1.6 Hooks (`browseHooks.ts`)
- `fetchPackages()`: HTTP GET to registry API
- `InstallPackage()`: Tauri invoke bridge
- `uninstallPackage()`: REST call (separate from Tauri commands)
- Integrated logging via `debugLogger`

#### 1.7 Debug Logger (`debugLogger.ts`)
- In-memory log buffer with timestamp prefix
- Pub/sub pattern for real-time updates
- `addLog(msg)`, `subscribeLogs(fn)`, `clearLogs()`

#### 1.8 Debug Panel (`debugPanel.tsx`)
- Scrollable terminal-like display
- Monospace cyan text on dark background
- Shows system events, network activity, errors

#### 1.9 Tab System (`tabs/`)
- `TabLayout.tsx`: Dynamic tab management with add/close
- `Tab.tsx`: Placeholder (minimal implementation)
- Type: `TabType = {id, title}`

---

### 2. Backend Bridge (src-tauri/)

#### 2.1 Tauri Configuration (`tauri.conf.json`)
- **Window**: 1200×800, title "Streamer Pack v1"
- **Dev**: Port 1420, strict port enforcement
- **HMR**: Custom WebSocket on port 1421 when Tauri dev host present
- **Bundle**: Multi-target (Windows/macOS/Linux), active code signing
- **Security**: CSP disabled (null) for plugin eval context

#### 2.2 Main Entry (`main.rs`)
Registers 6 Tauri commands:
```rust
get_packages          // Fetch registry list
install_package       // Download + extract ZIP
uninstall_package     // Remove local package
load_plugin           // Read index.mjs
call_dll              // Invoke native DLL function
```

#### 2.3 Plugin Manager (`plugin_manager.rs`)

**Install Flow** (`install_package`):
1. Extract name from URL (`package.zip` → `package`)
2. Resolve `AppData/streamer-pack/plugins/<name>/`
3. HTTP GET ZIP (blocking reqwest)
4. Write ZIP to disk
5. Extract with `zip::ZipArchive`
6. Clean up ZIP file

**Load Flow** (`load_plugin`):
1. Read `plugins/<name>/index.mjs` as UTF-8 string
2. Return raw source to frontend

**DLL Invocation** (`call_dll`):
1. Open `plugins/<name>/plugin.dll` via `libloading`
2. Lookup `call` symbol: `unsafe extern "C" fn(*const c_char, *const c_char) -> *const c_char`
3. Invoke with `(function_name, json_args)`
4. Convert result C-string → Rust String → JSON response

**Registry Fetch** (`get_packages`):
- GET `{API_URL}/api/packages` (default: `http://127.0.0.1:3000`)
- Deserializes to `Vec<Package>` via serde

**Local Listing** (`list_installed_packages`):
- Reads `plugins/` directory
- Returns subdirectory names

#### 2.4 Build Script (`build.rs`)
Minimal — just `tauri_build::build()`.

#### 2.5 Library Crate (`lib.rs`)
Placeholder — main logic in `main.rs`.

---

### 3. Package Format

Plugins are distributed as ZIP archives with this structure:

```
my-plugin.zip
├── index.mjs          # Required — ES module entry point
├── plugin.dll         # Optional — native x86_64 DLL
├── assets/            # Optional — images, fonts, etc.
└── manifest.json      # Optional — metadata
```

#### `index.mjs` Requirements
Must be a valid ES module that:
- Uses **default export** for React component
- Can reference `React`, `React/jsx-runtime`, `@tauri-apps/api/core` via transformed imports
- Runs in browser context (no Node.js APIs)

**Example**:
```javascript
import React from 'react';
import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function MyPlugin() {
  useEffect(() => {
    invoke('call_dll', { plugin: 'my-plugin', function: 'init' });
  }, []);
  return React.createElement('div', null, 'Hello from plugin!');
}
```

---

## Data Flow

### Installing a Package
```
[User clicks Install] 
        ↓
[Browse.tsx] → InstallPackage(url)
        ↓
[Tauri invoke: install_package]
        ↓
[Rust: download ZIP → extract → store in AppData]
        ↓
[Tauri: Ok("Installed X")]
        ↓
[Update installed list via list_installed_packages]
```

### Loading a Plugin
```
[User clicks package in sidebar]
        ↓
[App.tsx: fetchPlugin(pkg)]
        ↓
[Tauri invoke: load_plugin]
        ↓
[Rust: read plugins/<pkg>/index.mjs → return string]
        ↓
[Frontend: code transformation (import patching)]
        ↓
[Inject as <script type="module">]
        ↓
[Module executes, sets window.__pluginDefault]
        ↓
[Extract component, setState → render]
```

### Registry Query
```
[Frontend: fetchPackages()]
        ↓
[Direct HTTP GET localhost:3000/api/packages]
        ↓
[Rails/Express/API server: return JSON array]
        ↓
[Parse Package[] {id, name, description, downloadUrl}]
        ↓
[Render in Browse.tsx]
```

---

## Security Model

### Sandboxing
- Plugins run in **same origin** as main app (no iframe isolation)
- Full access to DOM, but no Node.js `require()` (browser context)
- Tauri commands are gated by Rust — plugins can only call exposed APIs

### Risks
1. **XSS via plugin code**: Plugins can execute arbitrary JS in app context
2. **Import hijacking**: Module patching could be tricked into rewriting non-plugin imports
3. **DLL execution**: Native code runs with user-level privileges

### Mitigations
- Regex-based import rewriting is strict (only known import patterns)
- No eval/Function constructor usage
- Tauri commands require explicit allowlist in `main.rs`
- CSP disabled but plugin source is not trusted as "safe"

---

## Build & Run

### Development
```bash
# Frontend only (Vite dev server)
npm run dev

# Full Tauri dev (Rust + Frontend)
npm run tauri:dev
```

### Production
```bash
# Build React app
npm run build

# Build Tauri binary
npm run tauri build
```

**Output**: Platform-specific binary in `src-tauri/target/release/`
- Windows: `.exe` + DLLs
- macOS: `.app` bundle
- Linux: AppImage/deb/rpm

---

## Configuration Points

### API Base URL
- Rust: `std::env::var("API_URL")` or fallback `http://127.0.0.1:3000`
- Frontend: Hardcoded `http://localhost:3000` in `browseHooks.ts`

### Plugin Directory
- Windows: `C:\Users\<user>\AppData\Roaming\streamer-pack\plugins\`
- macOS: `~/Library/Application Support/streamer-pack/plugins/`
- Linux: `~/.local/share/streamer-pack/plugins/`

### Registry Response Format
```json
[
  {
    "id": "unique-id",
    "name": "plugin-name",
    "description": "Plugin description",
    "downloadUrl": "/api/download/plugin-name.zip"
  }
]
```

---

## Known Limitations

1. **No plugin sandboxing** — all plugins share global `window`
2. **No hot reload** — app restart needed after plugin install
3. **Minimal tab implementation** — tabs created but not wired to plugin views
4. **Hardcoded registry URL** — no configuration UI
5. **No plugin versioning** — only one version installed at a time
6. **Single-window architecture** — no multi-window support

---

## Future Extensions

- [ ] Plugin manifest validation & version constraints
- [ ] Isolated iframe execution context for plugins
- [ ] Plugin permissions system (capability-based)
- [ ] Plugin settings/preferences storage
- [ ] Auto-update mechanism for installed plugins
- [ ] Plugin marketplace UI with search/filter
- [ ] Multi-window support for plugin instances
- [ ] Plugin-to-plugin communication bus
- [ ] WebAssembly plugin support (`.wasm` entry points)
- [ ] Source map support for plugin debugging

---

## Dependencies

### Frontend
- `react` ^19.1.0, `react-dom` ^19.1.0
- `@vitejs/plugin-react` ^4.6.0, `vite` ^7.0.4
- `@tauri-apps/api` ^2.10.1, `@tauri-apps/cli` ^2
- `@tailwindcss/vite` ^4.1.18, `tailwindcss` ^4.1.18
- `react-grid-layout` ^2.2.2, `react-resizable` ^3.1.3

### Backend (Rust)
- `tauri` ^2.10, `tauri-build` ^2
- `serde` ^1, `serde_json` ^1
- `reqwest` ^0.13 (blocking + json)
- `zip` ^8.6.0, `libloading` ^0.9.0
- `dirs` ^6.0

---

## License

TBD — project is in development (v0.1.0).

---

*This document is auto-generated from the codebase as of 2026-04-27. Last updated with full system analysis.*
