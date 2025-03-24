
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
import { LayoutDashboard, Upload, Package, BarChart3, Settings } from 'lucide-react';

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
                tooltip="My Components" 
                onClick={() => navigate('/supplier/components')}
              >
                <Package className="w-5 h-5 mr-2" />
                <span>My Components</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Analytics" 
                onClick={() => navigate('/supplier/analytics')}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                <span>Analytics</span>
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
