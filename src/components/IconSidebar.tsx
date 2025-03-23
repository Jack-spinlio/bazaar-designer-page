
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Pencil, 
  Bike, 
  Puzzle, 
  Bookmark, 
  Timeline, 
  Upload,
  Settings 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";

export const IconSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Pencil, label: "Edit", path: "/edit" },
    { icon: Bike, label: "Prefabs", path: "/prefabs" },
    { icon: Puzzle, label: "Components", path: "/components" },
    { icon: Bookmark, label: "Saved", path: "/saved" },
    { icon: Timeline, label: "Timeline", path: "/timeline" },
    { icon: Upload, label: "My Uploads", path: "/uploads" },
  ];

  return (
    <div className="w-16 border-r border-gray-200 flex flex-col items-center py-4 bg-white rounded-2xl h-full shadow-sm">
      <TooltipProvider>
        <div className="flex-1 flex flex-col gap-6 items-center">
          {sidebarItems.map((item, index) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Button 
                  variant={isActive(item.path) ? "default" : "ghost"} 
                  size="icon" 
                  className={
                    isActive(item.path) 
                      ? "bg-black text-white" 
                      : "text-gray-400 hover:text-gray-600"
                  }
                  onClick={() => navigate(item.path)}
                >
                  <item.icon size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400" onClick={() => navigate("/settings")}>
                <Settings size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};
