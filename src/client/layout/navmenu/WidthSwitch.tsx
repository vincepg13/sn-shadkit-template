import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlignHorizontalSpaceAround, StretchHorizontal } from "lucide-react";

export function WidthSwitch() {
  const { width, setWidth } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" onClick={() => setWidth(width === "fixed" ? "fluid" : "fixed")}>
          {width === "fluid" ? <AlignHorizontalSpaceAround /> : <StretchHorizontal />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{width === "fluid" ? <p>Switch to Fixed Width</p> : <p>Switch to Fluid Width</p>}</TooltipContent>
    </Tooltip>
  );
}
