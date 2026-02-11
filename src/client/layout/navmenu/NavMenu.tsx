import { Link } from "react-router";
import { useMediaQuery } from "react-responsive";
import { House, TableOfContents } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavMenu() {
  const navButtonClasses = "text-base font-medium py-0 px-3 items-center";
  const navLinkClasses = `${navigationMenuTriggerStyle()} ${navButtonClasses}`;
  const isXLUp = useMediaQuery({ minWidth: 1536 });

  return (
    <NavigationMenu viewport={!isXLUp} className="relative z-50">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navLinkClasses}>
            <Link to="/">
              <div className="flex items-center gap-2 text-base font-medium">
                <House className="size-5" />
                Home
              </div>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navLinkClasses}>
            <Link to="/demo">
              <div className="flex items-center gap-2 text-base font-medium">
                <TableOfContents className="size-5" />
                Demo
              </div>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
