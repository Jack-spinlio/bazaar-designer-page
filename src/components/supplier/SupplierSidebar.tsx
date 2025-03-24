
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, Package, PenLine, Upload } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const navItems = [
  { 
    path: '/supplier', 
    name: 'Products', 
    icon: <Package className="w-5 h-5" /> 
  },
  { 
    path: '/supplier/upload', 
    name: 'Upload Product', 
    icon: <Upload className="w-5 h-5" /> 
  },
  { 
    path: '/supplier/edit-profile', 
    name: 'Edit Profile', 
    icon: <PenLine className="w-5 h-5" /> 
  },
];

const SidebarToggle = () => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="absolute right-0 top-5 -mr-3 h-6 w-6 rounded-full bg-white shadow-md border hover:bg-gray-100 z-10"
      onClick={toggleSidebar}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export const SupplierSidebarInner = () => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="rounded-xl border shadow-md my-2.5 mx-2.5 mb-2.5 overflow-hidden">
      <SidebarContent className="py-4">
        <SidebarToggle />
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                tooltip={isCollapsed ? item.name : undefined}
              >
                <NavLink
                  to={item.path}
                  end={item.path === '/supplier'}
                  className={({ isActive }) => `
                    flex items-center gap-2 py-2 px-3 rounded-lg
                    ${isActive 
                      ? 'bg-black text-white' 
                      : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export const SupplierSidebar: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <SupplierSidebarInner />
    </SidebarProvider>
  );
};
