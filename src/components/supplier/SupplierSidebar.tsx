
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Upload, PenLine } from 'lucide-react';

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
    <div className="min-h-screen pt-10 pr-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <nav className="space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-black text-white font-medium'
                    : 'bg-[#f5f5f5] text-black hover:bg-gray-200'
                }`}
              >
                <span className={`mr-3 ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {item.icon}
                </span>
                <span className="font-bold">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
