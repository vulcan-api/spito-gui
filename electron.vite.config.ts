import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

const workerImportMetaUrlRE =
  /\bnew\s+(?:Worker|SharedWorker)\s*\(\s*(new\s+URL\s*\(\s*('[^']+'|"[^"]+"|`[^`]+`)\s*,\s*import\.meta\.url\s*\))/g;

export default defineConfig({
  main: {
    worker: {
      format: "es",
      plugins: [
        {
          name: "foo",
          enforce: "pre",
          transform(code): string | undefined {
            if (
              code.includes("new Worker") &&
              code.includes("new URL") &&
              code.includes("import.meta.url")
            ) {
              const result = code.replace(
                workerImportMetaUrlRE,
                `((() => { throw new Error('Nested workers are disabled') })()`
              );
              return result;
            }
            return undefined;
          }
        }
      ],
      rollupOptions: {
        output: {
          chunkFileNames: "assets/worker/[name]-[hash].js",
          assetFileNames: "assets/worker/[name]-[hash].js"
        }
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [react()]
  }
});
