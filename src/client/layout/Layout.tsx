import { ThemeSwitch } from "@/layout/ThemeSwitch";
import { WidthSwitch } from "@/layout/WidthSwitch";
import { Link, Outlet, useLocation } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/context/theme-context";

export default function Layout() {
  const { width } = useTheme();
  const location = useLocation();

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <main className="flex flex-col flex-1 p-4 gap-4">
        <div className="flex justify-between items-center w-full gap-1">
          <WidthSwitch />
          <Tabs value={location.pathname} className="w-full max-w-3xl">
            <TabsList className="w-full">
              <TabsTrigger value="/" asChild>
                <Link to="/">Home Page Route</Link>
              </TabsTrigger>
              <TabsTrigger value="/demo" asChild>
                <Link to="/demo">Demo Page Route</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <ThemeSwitch />
        </div>
        <div className={width === "fixed" ? "max-w-7xl w-full mx-auto" : "w-full"}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
