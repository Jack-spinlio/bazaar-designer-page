
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, UserCog, Upload, Building, Users } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const MarketplaceHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      </div>
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
      </div>
    </header>
  );
};
