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

async function main() {
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
      </React.StrictMode>
    );
  }
}

main();
