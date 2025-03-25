
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Upload, PenLine, ChevronRight, ChevronLeft, Grid, ShoppingBag } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";

const navItems = [
  { 
    path: '/supplier', 
    name: 'Dashboard', 
    icon: <Grid className="w-5 h-5" /> 
  },
  { 
    path: '/supplier/products', 
    name: 'Products', 
    icon: <Package className="w-5 h-5" /> 
  },
  { 
    path: '/supplier/orders', 
    name: 'Orders', 
    icon: <ShoppingBag className="w-5 h-5" /> 
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

export const SupplierSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // Set initial collapsed state to true
  useEffect(() => {
    const shouldCollapse = true; // Always default to collapsed
    setIsCollapsed(shouldCollapse);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={`min-h-screen pt-2.5 ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out relative`}>
      <div className="bg-white rounded-lg p-4 shadow-sm h-full">
        {/* Toggle Button - Moved to top right */}
        <button 
          onClick={toggleSidebar} 
          className="absolute -right-3 top-3 bg-gray-100 rounded-full p-1 shadow-md hover:bg-gray-200 transition-colors z-10"
        >
          {isCollapsed ? 
            <ChevronRight className="w-4 h-4" /> : 
            <ChevronLeft className="w-4 h-4" />
          }
        </button>

        <nav className="space-y-3 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-[50px] transition-colors ${
                  isActive
                    ? 'bg-black text-white font-medium'
                    : 'bg-[#f5f5f5] text-black hover:bg-gray-200'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-gray-700'} ${isCollapsed ? 'mr-0' : 'mr-3'}`}>
                  {isCollapsed ? 
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full ${isActive ? 'bg-black' : 'bg-[#f5f5f5]'}`}>
                      {item.icon}
                    </div> : 
                    item.icon
                  }
                </span>
                {!isCollapsed && <span className="font-bold">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
