/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @servicenow/sdk-app-plugin/no-unsupported-node-builtins */
import path from "path";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { defineConfig, type UserConfig } from "vite";
import { getAuthCookie, getCredentials, getUserSession } from "@servicenow/sdk-cli/dist/auth/index.js";

/**
 * Vite configuration for a ServiceNow build project. Only need development server
 * since ServiceNow handles production builds using rollup.
 * - Points Vite at the client folder
 * - Sets build output to a dev-only folder so it doesn't clash with SN
 * - Disables public folder since we don't use it
 * - Sets up alias for live tailwind css file during dev vs built css for prod
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async ({}): Promise<UserConfig> => {
  const creds = await getCredentials(undefined);
  const session = await getUserSession(creds);

  if (!session) {
    throw new Error(
      'Failed to load a ServiceNow SDK session for the Vite proxy. Run "now-sdk auth --add <instance>" and optionally set SN_SDK_CREDENTIAL_ALIAS.',
    );
  }

  const devUrl = creds.instanceUrl;
  const snCookie = getAuthCookie(session);
  const snUserToken = session.userToken;

  const injectCookie = (proxy: any) => {
    // For HTTP(S) requests
    proxy.on("proxyReq", (proxyReq: any) => {
      if (snCookie) proxyReq.setHeader("Cookie", snCookie);
      if (snUserToken) proxyReq.setHeader("X-UserToken", snUserToken);
    });
    // For WebSocket upgrade handshake
    proxy.on("proxyReqWs", (proxyReq: any) => {
      if (snCookie) proxyReq.setHeader("Cookie", snCookie);
      if (snUserToken) proxyReq.setHeader("X-UserToken", snUserToken);
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
        "/xmlhttp.do": {
          target: devUrl,
          changeOrigin: true,
          secure: false,
          configure: injectCookie,
        },
        "/amb": {
          target: devUrl,
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: injectCookie,
          headers: { Origin: devUrl },
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
