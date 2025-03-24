
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
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between px-4 pt-4">
          <h2 className="text-lg font-semibold">Supplier Portal</h2>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/dashboard')}
                tooltip="Dashboard" 
                onClick={() => navigate('/supplier/dashboard')}
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
              >
                <Package className="w-5 h-5 mr-2" />
                <span>Products</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/uploads')}
                tooltip="Upload Components" 
                onClick={() => navigate('/supplier/uploads')}
              >
                <Upload className="w-5 h-5 mr-2" />
                <span>Upload Components</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/supplier/orders')}
                tooltip="Orders" 
                onClick={() => navigate('/supplier/orders')}
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
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                <span>Enquiries</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Settings" 
                onClick={() => navigate('/settings')}
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
