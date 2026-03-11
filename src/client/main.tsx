//IMPORTANT - JS polyfills for SN
import "@/polyfills/array-entries.ts";
import "@/polyfills/array-from-iterable";

import React from "react";
import "./index.build.css";
import { makeRouter } from "./router.tsx";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { queryClient } from "./queryClient.ts";
import { bootstrapApp } from "./lib/init-shadkit.ts";
import { FontProvider } from "./context/font-context.tsx";
import { ThemeProvider } from "./context/theme-context.tsx";
import { QueryClientProvider } from "@tanstack/react-query";

// eslint-disable-next-line no-restricted-globals
const rootElement = document.getElementById("root");

function syncTailwindCssCacheBuster() {
  const entryScript = document.querySelector<HTMLScriptElement>('script[type="module"][src*="main.jsdbx"]');
  if (!entryScript?.src) return;

  const entryUrl = new URL(entryScript.src, window.location.href);
  const uxpcb = entryUrl.searchParams.get("uxpcb");
  if (!uxpcb) return;

  const stylesheetLinks = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href*="index.build.css"]');

  stylesheetLinks.forEach((link) => {
    const stylesheetUrl = new URL(link.href, window.location.href);
    if (!stylesheetUrl.searchParams.get("path")?.endsWith("index.build.css")) {
      return;
    }

    if (stylesheetUrl.searchParams.get("uxpcb") === uxpcb) return;

    stylesheetUrl.searchParams.set("uxpcb", uxpcb);
    link.href = stylesheetUrl.toString();
  });
}

async function main() {
  syncTailwindCssCacheBuster();

  await bootstrapApp();
  const router = makeRouter();

  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ThemeProvider
          defaultTheme="light"
          themeStorageKey="shadcn.template.theme"
          widthStorageKey="shadcn.template.width"
        >
          <FontProvider>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
            </QueryClientProvider>
          </FontProvider>
        </ThemeProvider>
      </React.StrictMode>,
    );
  }
}

main();