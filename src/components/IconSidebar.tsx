
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Bike, 
  Puzzle, 
  Bookmark, 
  Clock, 
  Upload,
  FileSpreadsheet
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FileUploader } from "@/components/FileUploader";
import { ComponentItem } from "./Sidebar";

interface IconSidebarProps {
  activeTab?: string | null;
  setActiveTab?: (tab: string | null) => void;
}

export const IconSidebar = ({ activeTab, setActiveTab }: IconSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const handleTabClick = (tabId: string) => {
    if (setActiveTab) {
      if (activeTab === tabId) {
        setActiveTab(null);
      } else {
        setActiveTab(tabId);
      }
    }
    
    if (location.pathname !== '/design') {
      navigate('/design');
    }
  };
  
  const sidebarItems = [
    { id: "edit", icon: Pencil, label: "Edit" },
    { id: "prefabs", icon: Bike, label: "Prefabs" },
    { id: "components", icon: Puzzle, label: "Components" },
    { id: "bom", icon: FileSpreadsheet, label: "BOM" },
    { id: "saved", icon: Bookmark, label: "Saved" },
    { id: "timeline", icon: Clock, label: "Timeline" },
  ];

  const handleComponentUploaded = (component: ComponentItem) => {
    console.log('Component uploaded:', component);
    setUploadDialogOpen(false);
  };

  return (
    <>
      <div className="w-16 border-r border-gray-200 flex flex-col items-center py-4 bg-white rounded-2xl h-full shadow-sm">
        <TooltipProvider>
          <div className="flex-1 flex flex-col gap-6 items-center">
            {sidebarItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button 
                    variant={activeTab === item.id ? "default" : "ghost"} 
                    size="icon" 
                    className={
                      activeTab === item.id
                        ? "bg-black text-white hover:bg-black hover:text-white" 
                        : "text-gray-400 hover:text-gray-600"
                    }
                    onClick={() => handleTabClick(item.id)}
                  >
                    <item.icon size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Upload size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Upload Component</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Upload dialog for designers */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Upload 3D Component</DialogTitle>
          <FileUploader 
            onClose={() => setUploadDialogOpen(false)} 
            onFileUploaded={handleComponentUploaded}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
