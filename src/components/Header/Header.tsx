
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Upload, UserCog } from 'lucide-react';
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
  DropdownMenuGroup,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup
} from "@/components/ui/dropdown-menu";

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSupplierPage = location.pathname.includes('/supplier');
  const isDesignPage = location.pathname === '/design';
  const [userRole, setUserRole] = React.useState(
    isSupplierPage ? 'supplier' : 'designer'
  );
  
  const handleRoleChange = (value: string) => {
    setUserRole(value);
    if (value === 'supplier') {
      navigate('/supplier');
      toast.success('Switched to Supplier mode');
    } else {
      if (location.pathname.startsWith('/supplier')) {
        navigate('/design');
      }
      toast.success('Switched to Designer mode');
    }
  };
  
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 z-10 bg-white rounded-2xl shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/marketplace" className="text-3xl font-bold text-gray-900">
          Bazaar
        </Link>
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
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal text-xs text-gray-500 pl-2">Switch Role</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={userRole} onValueChange={handleRoleChange}>
                  <DropdownMenuRadioItem value="designer">
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Designer</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="supplier">
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Supplier</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/marketplace">Marketplace</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/design">Design</Link>
              </DropdownMenuItem>
              {userRole === 'supplier' && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/supplier">Supplier Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/supplier/products">Products</Link>
                  </DropdownMenuItem>
                </>
              )}
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
