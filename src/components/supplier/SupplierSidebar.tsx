
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarHeader
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Upload,
  Package,
  ShoppingCart,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SupplierSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [minimized, setMinimized] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const toggleMinimize = () => {
    setMinimized(!minimized);
  };
  
  return (
    <SidebarProvider>
      <Sidebar 
        className={`bg-white text-gray-800 shadow-lg rounded-xl ml-0 mt-24
                    ${minimized ? 'w-[70px]' : 'w-fit'}`}
        variant="floating"
      >
        <SidebarHeader className="flex items-center justify-between px-4 pt-4 pb-2 relative">
          <div className="flex items-center">
            {/* Logo removed as requested */}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMinimize} 
            className="absolute -right-4 top-0 bg-white rounded-full shadow-md h-8 w-8 flex items-center justify-center p-0"
          >
            {minimized ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <SidebarTrigger className="hidden" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="gap-2 px-2">
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/dashboard')}
                tooltip="Dashboard" 
                onClick={() => navigate('/supplier/dashboard')}
                className={`rounded-full py-3 px-4 ${isActive('/supplier/dashboard') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'} flex justify-start`}
              >
                <LayoutDashboard className={`w-5 h-5 ${minimized ? 'mx-auto' : 'mr-2'}`} />
                {!minimized && <span>Dashboard</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/products')}
                tooltip="Products" 
                onClick={() => navigate('/supplier/products')}
                className={`rounded-full py-3 px-4 ${isActive('/supplier/products') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'} flex justify-start`}
              >
                <Package className={`w-5 h-5 ${minimized ? 'mx-auto' : 'mr-2'}`} />
                {!minimized && <span>My Products</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/uploads')}
                tooltip="Upload Components" 
                onClick={() => navigate('/supplier/uploads')}
                className={`rounded-full py-3 px-4 ${isActive('/supplier/uploads') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'} flex justify-start`}
              >
                <Upload className={`w-5 h-5 ${minimized ? 'mx-auto' : 'mr-2'}`} />
                {!minimized && <span>Upload</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/orders')}
                tooltip="Orders" 
                onClick={() => navigate('/supplier/orders')}
                className={`rounded-full py-3 px-4 ${isActive('/supplier/orders') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'} flex justify-start`}
              >
                <ShoppingCart className={`w-5 h-5 ${minimized ? 'mx-auto' : 'mr-2'}`} />
                {!minimized && <span>Orders</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/enquiries')}
                tooltip="Enquiries" 
                onClick={() => navigate('/supplier/enquiries')}
                className={`rounded-full py-3 px-4 ${isActive('/supplier/enquiries') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'} flex justify-start`}
              >
                <MessageSquare className={`w-5 h-5 ${minimized ? 'mx-auto' : 'mr-2'}`} />
                {!minimized && <span>Enquiries</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/settings')}
                tooltip="Settings" 
                onClick={() => navigate('/supplier/settings')}
                className={`rounded-full py-3 px-4 ${isActive('/supplier/settings') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'} flex justify-start`}
              >
                <Settings className={`w-5 h-5 ${minimized ? 'mx-auto' : 'mr-2'}`} />
                {!minimized && <span>Settings</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};
