
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Upload, UserCog, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/auth/useAuth';
import { LoginDialog } from '@/components/auth/LoginDialog';
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

export const MarketplaceHeader: React.FC = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = React.useState('designer');
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  const handleRoleChange = (value: string) => {
    setUserRole(value);
    if (value === 'supplier') {
      navigate('/supplier/dashboard');
      toast.success('Switched to Supplier mode');
    } else {
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
        
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src={user?.picture || "https://github.com/shadcn.png"} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user?.name || "My Account"}</DropdownMenuLabel>
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
                <Link to="/design">Design Interface</Link>
              </DropdownMenuItem>
              {userRole === 'supplier' && (
                <DropdownMenuItem asChild>
                  <Link to="/supplier/uploads">Upload Components</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/saved">Saved Designs</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowLoginDialog(true)}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        )}
      </div>
      
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  );
};
