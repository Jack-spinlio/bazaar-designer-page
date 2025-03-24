
import React from 'react';
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
  Settings
} from 'lucide-react';

export const SupplierSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <SidebarProvider>
      <Sidebar className="bg-black text-white">
        <SidebarHeader className="flex items-center justify-between px-6 pt-6 pb-6">
          <h2 className="text-2xl font-bold">Bazaar</h2>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/dashboard')}
                tooltip="Dashboard" 
                onClick={() => navigate('/supplier/dashboard')}
                className={`rounded-full py-2.5 px-4 ${isActive('/supplier/dashboard') ? 'bg-black text-white' : 'hover:bg-gray-700'}`}
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/products')}
                tooltip="Products" 
                onClick={() => navigate('/supplier/products')}
                className={`rounded-full py-2.5 px-4 ${isActive('/supplier/products') ? 'bg-black text-white' : 'hover:bg-gray-700'}`}
              >
                <Package className="w-5 h-5 mr-2" />
                <span>My Products</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/uploads')}
                tooltip="Upload Components" 
                onClick={() => navigate('/supplier/uploads')}
                className={`rounded-full py-2.5 px-4 ${isActive('/supplier/uploads') ? 'bg-black text-white' : 'hover:bg-gray-700'}`}
              >
                <Upload className="w-5 h-5 mr-2" />
                <span>Upload</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/orders')}
                tooltip="Orders" 
                onClick={() => navigate('/supplier/orders')}
                className={`rounded-full py-2.5 px-4 ${isActive('/supplier/orders') ? 'bg-black text-white' : 'hover:bg-gray-700'}`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span>Orders</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/enquiries')}
                tooltip="Enquiries" 
                onClick={() => navigate('/supplier/enquiries')}
                className={`rounded-full py-2.5 px-4 ${isActive('/supplier/enquiries') ? 'bg-black text-white' : 'hover:bg-gray-700'}`}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                <span>Enquiries</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/settings')}
                tooltip="Settings" 
                onClick={() => navigate('/supplier/settings')}
                className={`rounded-full py-2.5 px-4 ${isActive('/supplier/settings') ? 'bg-black text-white' : 'hover:bg-gray-700'}`}
              >
                <Settings className="w-5 h-5 mr-2" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};
