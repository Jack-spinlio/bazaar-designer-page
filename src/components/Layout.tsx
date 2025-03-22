
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Viewport } from './Viewport';
import { SnapPointTools } from './SnapPointTools';
import { StatusBar } from './StatusBar';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleTools = () => setToolsOpen(prev => !prev);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-app-gray-lighter">
      <header className="flex items-center justify-between px-4 py-2 border-b border-app-gray-light/20 glassmorphism z-10">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hover:bg-app-blue/10 text-app-gray-dark hover:text-app-blue"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <h1 className="text-xl font-medium text-app-gray-dark">3D Component Snap Point Manager</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Additional header controls would go here */}
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <div 
          className={`transition-all duration-300 ease-in-out transform ${
            sidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full w-0'
          }`}
        >
          {sidebarOpen && <Sidebar />}
        </div>

        <main className="flex-1 flex flex-col relative">
          <Viewport />
          {children}
        </main>

        <div 
          className={`transition-all duration-300 ease-in-out transform ${
            toolsOpen ? 'translate-x-0 w-80' : 'translate-x-full w-0'
          }`}
        >
          {toolsOpen && <SnapPointTools onClose={() => setToolsOpen(false)} />}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTools}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 hover:bg-app-blue/10 text-app-gray-dark hover:text-app-blue ${
            toolsOpen ? 'mr-80' : 'mr-0'
          }`}
        >
          {toolsOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      <StatusBar />
      <Toaster />
    </div>
  );
};
