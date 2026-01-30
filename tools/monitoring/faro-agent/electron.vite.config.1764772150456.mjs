// electron.vite.config.ts
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
var __electron_vite_injected_dirname = "/Users/tonyhenderson/Documents/GitHub/faro/pravia-monorepo/tools/monitoring/faro-agent";
var VITE_PORT = process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173;
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: resolve(__electron_vite_injected_dirname, "electron/main.ts")
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: resolve(__electron_vite_injected_dirname, "electron/preload.ts")
      }
    }
  },
  renderer: {
    root: ".",
    server: {
      port: VITE_PORT
    },
    build: {
      rollupOptions: {
        input: resolve(__electron_vite_injected_dirname, "index.html")
      }
    },
    resolve: {
      alias: {
        "src": resolve(__electron_vite_injected_dirname, "src")
      }
    },
    plugins: [react()]
  }
});
export {
  electron_vite_config_default as default
};
