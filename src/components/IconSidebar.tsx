
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Bike, 
  Puzzle, 
  Bookmark, 
  Clock, 
  Upload,
  FileSpreadsheet,
  Layers
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FileUploader } from "@/components/FileUploader";

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
    
    if (location.pathname !== '/studio') {
      navigate('/studio');
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

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setUploadDialogOpen(true);
  };

  return (
    <>
      <div className="w-16 border-r border-gray-200 flex flex-col items-center py-4 bg-white rounded-2xl h-full shadow-sm">
        <TooltipProvider>
          <div className="flex-1 flex flex-col gap-6 items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={location.pathname === '/studio' ? "default" : "ghost"} 
                  size="icon" 
                  className={
                    location.pathname === '/studio' 
                      ? "bg-black text-white hover:bg-black hover:text-white" 
                      : "text-gray-400 hover:text-gray-600"
                  }
                  onClick={() => navigate('/studio')}
                >
                  <Layers size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Design Studio</p>
              </TooltipContent>
            </Tooltip>
            
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
                  variant={activeTab === "uploads" ? "default" : "ghost"} 
                  size="icon" 
                  className={
                    activeTab === "uploads"
                      ? "bg-black text-white hover:bg-black hover:text-white" 
                      : "text-gray-400 hover:text-gray-600"
                  }
                  onClick={handleUploadClick}
                >
                  <Upload size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Upload</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Upload File</DialogTitle>
          <FileUploader 
            onClose={() => setUploadDialogOpen(false)} 
            onFileUploaded={() => {
              setUploadDialogOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
