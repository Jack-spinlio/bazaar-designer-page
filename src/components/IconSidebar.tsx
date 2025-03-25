
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Bike, 
  Puzzle, 
  Bookmark, 
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

// Create a custom SVG component for the timeline icon to support color changes
const TimelineIcon = ({ className }: { className?: string }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path d="M13.8995 4.10002V9.35002C13.8995 9.91002 14.3495 10.35 14.8995 10.35H20.1495M13.8995 4.10002H7.89954C6.89954 4.10002 6.09954 4.90002 6.09954 5.90002V19.9C6.09954 20.9 6.89954 21.7 7.89954 21.7H18.8995C19.8995 21.7 20.6995 20.9 20.6995 19.9V10.35M13.8995 4.10002L20.1495 10.35M11.3495 16.36H16.4995M9.34954 12.1H16.4995" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
    { id: "timeline", icon: TimelineIcon, label: "Timeline" },
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
                    <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-gray-400"} />
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
