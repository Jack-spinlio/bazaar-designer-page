
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Upload,
  Package,
  ShoppingCart,
  MessageSquare,
  Settings,
  Monitor,
  Wrench
} from 'lucide-react';

export const SupplierSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <SidebarProvider>
      <Sidebar 
        className="bg-white border-r border-gray-100 shadow-sm h-screen fixed left-0 top-0 z-30 w-[90px]"
        variant="floating"
      >
        <SidebarContent className="pt-24">
          <SidebarMenu className="flex flex-col items-center gap-6">
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/dashboard')}
                tooltip="Dashboard" 
                onClick={() => navigate('/supplier/dashboard')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl h-14 w-14 ${isActive('/supplier/dashboard') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Monitor className="w-6 h-6" />
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/products')}
                tooltip="Products" 
                onClick={() => navigate('/supplier/products')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl h-14 w-14 ${isActive('/supplier/products') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Package className="w-6 h-6" />
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/uploads')}
                tooltip="Upload" 
                onClick={() => navigate('/supplier/uploads')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl h-14 w-14 ${isActive('/supplier/uploads') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Upload className="w-6 h-6" />
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/orders')}
                tooltip="Orders" 
                onClick={() => navigate('/supplier/orders')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl h-14 w-14 ${isActive('/supplier/orders') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ShoppingCart className="w-6 h-6" />
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/enquiries')}
                tooltip="Messages" 
                onClick={() => navigate('/supplier/enquiries')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl h-14 w-14 ${isActive('/supplier/enquiries') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <MessageSquare className="w-6 h-6" />
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/settings')}
                tooltip="Settings" 
                onClick={() => navigate('/supplier/settings')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl h-14 w-14 ${isActive('/supplier/settings') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Wrench className="w-6 h-6" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};
