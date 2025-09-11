/* eslint-disable no-restricted-globals */
import { createContext, useContext, useEffect, useState } from "react";

type AppWidth = "fixed" | "fluid";
type Theme = "dark" | "light" | "system";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void, width: AppWidth; setWidth: (w: AppWidth) => void };

const ThemeCtx = createContext<Ctx>({ theme: "system", setTheme: () => {}, width: "fixed", setWidth: () => {} });

const resolve = (t: Theme) =>
  t === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : t;

export function ThemeProvider({
  children,
  defaultTheme = "system",
  themeStorageKey = "vite-ui-theme",
  defaultWidth = "fixed",
  widthStorageKey = "vite-ui-width"
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  themeStorageKey?: string;
  defaultWidth?: AppWidth;
  widthStorageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(themeStorageKey) as Theme) || defaultTheme);
  const [width, setWidth] = useState<AppWidth>(() => (localStorage.getItem(widthStorageKey) as AppWidth) || defaultWidth);

  useEffect(() => {
    const next = resolve(theme);
    const els: Element[] = [document.documentElement, document.body, document.getElementById("root")!].filter(
      Boolean
    ) as Element[];

    els.forEach((el) => {
      el.classList.remove("light", "dark");
      el.classList.add(next);
    });

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = next === "dark" ? "#020817" : "#ffffff";
  }, [theme]);

  return (
    <ThemeCtx.Provider
      value={{
        theme,
        width,
        setTheme: (t) => {
          localStorage.setItem(themeStorageKey, t);
          setTheme(t);
        },
        setWidth: (w) => {
          localStorage.setItem(widthStorageKey, w);
          setWidth(w);
        },
      }}
    >
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
