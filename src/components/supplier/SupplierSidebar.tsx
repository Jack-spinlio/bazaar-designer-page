
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PackagePlus, Package, Store, LayoutDashboard, PenLine, Upload } from 'lucide-react';

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

export const SupplierSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen bg-gray-50 border-r border-gray-200">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <Store className="h-8 w-8 text-purple-600" />
          <h1 className="text-xl font-semibold">Supplier Portal</h1>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={`mr-3 ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
