import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function SidebarSwitch({
  showSidebar,
  setShowSidebar,
}: {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{showSidebar ? 'Close sidebar' : 'Open sidebar'}</TooltipContent>
    </Tooltip>
  );
}
