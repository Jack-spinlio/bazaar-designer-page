
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
        className={`bg-white text-gray-800 border-0 top-[60px] shadow-lg rounded-xl mt-4 mx-4 
                    ${minimized ? 'w-[80px]' : 'w-[220px]'}`}
        variant="floating"
      >
        <SidebarHeader className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center">
            {!minimized && <h2 className="text-2xl font-bold text-black">Bazaar</h2>}
          </div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMinimize} 
              className="h-7 w-7 text-gray-500 hover:text-black"
            >
              {minimized ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="gap-2 px-2">
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/dashboard')}
                tooltip="Dashboard" 
                onClick={() => navigate('/supplier/dashboard')}
                className={`rounded-full py-3 px-4 ${isActive('/supplier/dashboard') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'}`}
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
                className={`rounded-full py-3 px-4 ${isActive('/supplier/products') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'}`}
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
                className={`rounded-full py-3 px-4 ${isActive('/supplier/uploads') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'}`}
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
                className={`rounded-full py-3 px-4 ${isActive('/supplier/orders') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'}`}
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
                className={`rounded-full py-3 px-4 ${isActive('/supplier/enquiries') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'}`}
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
                className={`rounded-full py-3 px-4 ${isActive('/supplier/settings') ? 'bg-black text-white font-medium' : 'hover:bg-gray-100 text-gray-800'}`}
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
