import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ChevronsLeftRightEllipsis } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSubButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useState } from "react";

export function AppSidebar() {
  return (
    <Sidebar className="!bg-red">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-0 justify-center h-[36px]" asChild>
              <Link to="/">
                <div className="flex items-center justify-center py-4">
                  <ChevronsLeftRightEllipsis className="inline-block mr-2 h-5 w-5 align-middle" />
                  <span className="text-base font-semibold">Sidebar Header</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <p className="text-xs text-muted-foreground px-2 pb-2 ">Demonstration of navigation header section</p>
        </SidebarGroup>

        <Separator />

        <SidebarGroup>
          <SidebarGroupLabel>Demonstration Menu</SidebarGroupLabel>
          <p className="text-xs text-muted-foreground px-2 pb-2 ">Demonstration of navigation links</p>

          <CollapsibleMenu
            title="Collapsible Menu Demo"
            items={[
              { label: "Home Page", to: "/" },
              { label: "Table Demo", to: "/demo" },
            ]}
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

function CollapsibleMenu({ title, items }: { title?: string; items?: { label: string; to: string }[] }) {
  const [open, setOpen] = useState(true);

  return (
    <SidebarMenu>
      <Collapsible asChild open={open} onOpenChange={setOpen} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <span className="font-semibold">{title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub className="mr-0 pr-0">
              {items?.map((item, index) => (
                <SidebarMenuSubItem key={index} className="flex items-center justify-between">
                  <SidebarMenuSubButton asChild>
                    <Link to={item.to} className="flex-1">
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
