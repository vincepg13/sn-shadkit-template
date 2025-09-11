/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @servicenow/sdk-app-plugin/no-unsupported-node-builtins */
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

/**
 * Vite configuration for a ServiceNow build project. Only need development server
 * since ServiceNow handles production builds using rollup.
 * - Points Vite at the client folder
 * - Sets build output to a dev-only folder so it doesn't clash with SN
 * - Disables public folder since we don't use it
 * - Sets up alias for live tailwind css file during dev vs built css for prod
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const devUrl = env.VITE_DEV_URL;
  const snCookie = env.VITE_SPOOF_COOKIE;

  console.log("Vite Config - Dev URL:", devUrl);

  const injectCookie = (proxy: any) => {
    // For HTTP(S) requests
    proxy.on("proxyReq", (proxyReq: any) => {
      if (snCookie) proxyReq.setHeader("Cookie", snCookie);
    });
    // For WebSocket upgrade handshake
    proxy.on("proxyReqWs", (proxyReq: any) => {
      if (snCookie) proxyReq.setHeader("Cookie", snCookie);
    });
  };

  return {
    root: "src/client",
    envDir: process.cwd(),
    plugins: [react(), tailwind()],
    base: "./",
    preview: { port: 5173 },
    build: { outDir: "../../.vite-dist", emptyOutDir: true },
    publicDir: false,
    server: {
      proxy: {
        "/api": {
          target: devUrl,
          changeOrigin: true,
          secure: false,
          configure: injectCookie,
        },
        "/angular.do": {
          target: devUrl,
          changeOrigin: true,
          secure: false,
          configure: injectCookie,
        },
        "/sys_script.do": {
          target: devUrl,
          changeOrigin: true,
          secure: false,
          configure: injectCookie,
        },
      },
      fs: {
        allow: [".."],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/client"),
        "./index.build.css": "./index.css",
      },
    },
  };
});
