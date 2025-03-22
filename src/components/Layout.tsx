
import React, { useState } from 'react';
import { Sidebar, ComponentItem } from './Sidebar';
import { Viewport } from './Viewport';
import { StatusBar } from './StatusBar';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { IconSidebar } from './IconSidebar';
import { 
  Edit, 
  Share, 
  ArrowUpFromLine,
  Bell
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  
  const handleComponentSelected = (component: ComponentItem) => {
    setSelectedComponent(component);
    console.log('Component selected in Layout:', component.name);
  };
  
  const handleComponentPlaced = () => {
    console.log('Component placed in scene');
    setSelectedComponent(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Bazaar</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center text-gray-600 mr-4">
            <span>My Design /</span>
            <span className="font-semibold ml-1">Bazaar Road bike</span>
            <Button variant="ghost" size="icon" className="ml-1">
              <Edit size={16} />
            </Button>
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
        <div className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-80' : 'w-0'
        }`}>
          {sidebarOpen && <Sidebar onSelectComponent={handleComponentSelected} />}
        </div>

        <main className="flex-1 flex flex-col relative">
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
