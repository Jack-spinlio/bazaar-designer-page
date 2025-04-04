
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCog, Upload, Building, LayoutDashboard, Bell, Users } from 'lucide-react';
import { DesignTitle } from './DesignTitle';
import { SharePopover } from './SharePopover';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSupplierPage = location.pathname.includes('/supplier');
  const isDesignPage = location.pathname === '/design';
  const isMarketplacePage = location.pathname.includes('/marketplace');
  const isExhibitorsPage = location.pathname.includes('/exhibitors');
  
  const handleNavigation = (path: string, role: string) => {
    navigate(path);
    toast.success(`Switched to ${role} mode`);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 z-10 bg-white rounded-2xl shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/marketplace" className="text-3xl font-bold text-gray-900">
          Bazaar
        </Link>
        <nav className="hidden md:flex items-center space-x-4 ml-4">
          <Link 
            to="/marketplace" 
            className={`text-sm font-medium ${isMarketplacePage ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Marketplace
          </Link>
          <Link 
            to="/exhibitors" 
            className={`text-sm font-medium ${isExhibitorsPage ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Exhibitors
          </Link>
          <Link 
            to="/supplier" 
            className={`text-sm font-medium ${isSupplierPage ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Supplier Dashboard
          </Link>
          <Link 
            to="/design" 
            className={`text-sm font-medium ${isDesignPage ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Design Studio
          </Link>
        </nav>
      </div>
      <div className="flex items-center">
        {isDesignPage && (
          <div className="flex items-center mr-4">
            <DesignTitle initialTitle="Bazaar Road bike" />
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              
              <DropdownMenuItem
                className="relative cursor-pointer"
                onClick={() => handleNavigation('/design', 'Designer')}
              >
                <UserCog className="mr-2 h-4 w-4" />
                <span>Designer</span>
                {isDesignPage && (
                  <div className="absolute right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem
                className="relative cursor-pointer"
                onClick={() => handleNavigation('/supplier', 'Supplier')}
              >
                <Upload className="mr-2 h-4 w-4" />
                <span>Supplier</span>
                {isSupplierPage && (
                  <div className="absolute right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem
                className="relative cursor-pointer"
                onClick={() => handleNavigation('/marketplace', 'Marketplace')}
              >
                <Building className="mr-2 h-4 w-4" />
                <span>Marketplace</span>
                {isMarketplacePage && (
                  <div className="absolute right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem
                className="relative cursor-pointer"
                onClick={() => handleNavigation('/exhibitors', 'Exhibitors')}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Exhibitors</span>
                {isExhibitorsPage && (
                  <div className="absolute right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {!isSupplierPage && <SharePopover />}
        </div>
      </div>
    </header>
  );
};
