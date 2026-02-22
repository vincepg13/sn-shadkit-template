import { NavMenu } from "./navmenu/NavMenu";
import { SnSimpleTooltip } from "sn-shadcn-kit/ui";
import { useTheme } from "@/context/theme-context";
import { Outlet } from "react-router";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitch } from "@/layout/navmenu/ThemeSwitch";
import { WidthSwitch } from "@/layout/navmenu/WidthSwitch";
import { AppSidebar } from "./sidebar/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useMemo } from "react";

export default function Layout() {
  const { width } = useTheme();
  const [open, setOpen] = useState<boolean>(true);
  const widthClasses = width === "fluid" ? "w-full" : "max-w-7xl w-full mx-auto";

  const sidebarStyle = useMemo(() => {
    return {
      "--sidebar-width": "16rem",
      "--sidebar-width-mobile": "18rem",
    } as React.CSSProperties;
  }, []);

  return (
    <SidebarProvider defaultOpen={true} open={open} onOpenChange={setOpen} style={sidebarStyle}>
      <AppSidebar />

      <div className="h-screen w-full bg-background text-foreground overflow-hidden">
        {/* <Toaster
          richColors
          duration={5000}
          position="top-right"
          toastOptions={{
            classNames: {
              toast: "!rounded-lg !border !border-border !bg-background !text-foreground shadow-lg",
              title: "font-semibold text-sm",
              error: "!bg-red-500 !text-white !border-red-600",
              info: "!bg-blue-400 !text-primary-foreground dark:!bg-blue-700 dark:!text-accent-foreground",
              success: "!bg-lime-600 !text-white dark:!bg-lime-950",
              description: "!text-muted-foreground",
              actionButton: "!bg-primary !text-primary-foreground !rounded-md !px-2 !py-1",
              cancelButton: "!bg-muted !text-muted-foreground !rounded-md !px-2 !py-1",
              closeButton: "!ring-0",
            },
          }}
        /> */}
        <main className="grid h-full grid-rows-[auto_1fr]">
          {/* Row 1: header */}
          <div className="shrink-0 max-w-[100vw]">
            <div className="flex justify-between xl:grid xl:grid-cols-[1fr_2fr_1fr] px-4 pt-4 items-center w-full gap-1">
              <div className="flex items-center gap-0">
                <SnSimpleTooltip content="Sidebar">
                  <SidebarTrigger />
                </SnSimpleTooltip>
                <WidthSwitch />
                <ThemeSwitch />
              </div>
              <div className="flex justify-center">
                <NavMenu />
              </div>
              <div className="flex justify-end">
                
              </div>
            </div>
            <Separator className="mt-4" />
          </div>

          {/* Row 2: conent. Row itself doesn't scroll. */}
          <div className="min-h-0 overflow-hidden">
            <div className="grid h-full min-h-0">
              {/* Content pane: this is the default scroller for most pages */}
              <section
                className={`min-h-0 overflow-auto pt-4 px-4`}
              >
                <div className={`${widthClasses} h-full min-h-0 flex flex-col`}>
                  <Outlet />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
