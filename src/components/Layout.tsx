
import React from 'react';
import { Sidebar, ComponentItem } from './Sidebar';
import { Viewport } from './Viewport';
import { StatusBar } from './StatusBar';
import { Button } from '@/components/ui/button';
import { IconSidebar } from './IconSidebar';
import { Input } from '@/components/ui/input';
import { 
  Edit, 
  Share, 
  ArrowUpFromLine,
  Bell,
  Check,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [selectedComponent, setSelectedComponent] = React.useState<ComponentItem | null>(null);
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [designTitle, setDesignTitle] = React.useState("Bazaar Road bike");
  const [tempTitle, setTempTitle] = React.useState(designTitle);
  
  // Get current location to determine whether to show the sidebar
  const location = useLocation();
  const showComponentSidebar = location.pathname === '/components';
  
  const handleComponentSelected = (component: ComponentItem) => {
    setSelectedComponent(component);
    console.log('Component selected in Layout:', component.name);
  };
  
  const handleComponentPlaced = () => {
    console.log('Component placed in scene');
    setSelectedComponent(null);
  };

  const handleEditTitle = () => {
    setTempTitle(designTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = async () => {
    if (tempTitle.trim() === '') {
      toast.error("Design name cannot be empty");
      return;
    }

    setDesignTitle(tempTitle);
    setIsEditingTitle(false);
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('designs')
        .upsert({ 
          id: 'current-design', // Using a fixed ID for simplicity
          name: tempTitle 
        });
        
      if (error) throw error;
      toast.success("Design name saved");
    } catch (error) {
      console.error("Error saving design name:", error);
      toast.error("Failed to save design name");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
  };

  return (
    <div className="flex flex-col h-screen p-2.5 overflow-hidden bg-[#F5F5F5]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 z-10 bg-white rounded-2xl mb-2.5 shadow-sm" style={{ margin: '10px' }}>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Bazaar</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center text-gray-600 mr-4">
            <span>My Design /</span>
            {isEditingTitle ? (
              <div className="flex items-center ml-1">
                <Input
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="h-8 mr-1 w-40"
                  autoFocus
                />
                <Button variant="ghost" size="icon" onClick={handleSaveTitle} className="h-8 w-8">
                  <Check size={16} className="text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="h-8 w-8">
                  <X size={16} className="text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <span className="font-semibold ml-1">{designTitle}</span>
                <Button variant="ghost" size="icon" className="ml-1" onClick={handleEditTitle}>
                  <Edit size={16} />
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button className="px-6 flex items-center gap-2 rounded-full bg-black text-white hover:bg-gray-800">
              <Share size={16} className="mr-1" />
              Share
              <ArrowUpFromLine size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <IconSidebar />
        
        {/* Only show component sidebar for the Components page */}
        {showComponentSidebar && (
          <div className="w-80 transition-all duration-300 ease-in-out" style={{ margin: '10px' }}>
            <Sidebar onSelectComponent={handleComponentSelected} />
          </div>
        )}

        <main className={`flex-1 flex flex-col relative rounded-2xl overflow-hidden ml-2.5 ${!showComponentSidebar ? 'w-full' : ''}`} style={{ margin: '10px' }}>
          <Viewport 
            selectedComponent={selectedComponent} 
            onComponentPlaced={handleComponentPlaced} 
          />
          {children}
        </main>
      </div>
    </div>
  );
};
