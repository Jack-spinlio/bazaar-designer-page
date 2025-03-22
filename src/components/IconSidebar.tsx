
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  Pencil, 
  Bike,
  Settings,
  Bookmark,
  Download
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const IconSidebar = () => {
  return (
    <div className="w-16 border-r border-gray-200 flex flex-col items-center py-4 bg-white">
      <TooltipProvider>
        <div className="flex flex-col gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <LayoutGrid size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Dashboard</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Pencil size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-black text-white rounded-full p-2">
                <Bike size={20} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Bikes</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Settings size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Bookmark size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Bookmarks</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Download size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};
