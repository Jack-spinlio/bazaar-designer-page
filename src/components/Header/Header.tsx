
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
import { DesignTitle } from './DesignTitle';
import { SharePopover } from './SharePopover';
import { Link, useLocation } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const Header: React.FC = () => {
  const location = useLocation();
  const isProducerPage = location.pathname.includes('/producer');
  
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 z-10 bg-white rounded-2xl shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/marketplace" className="text-3xl font-bold text-gray-900">
          Bazaar
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <DesignTitle initialTitle="Bazaar Road bike" />
        </div>
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
              <DropdownMenuItem asChild>
                <Link to="/marketplace">Marketplace</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/edit">Design Interface</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/saved">Saved Designs</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {!isProducerPage && <SharePopover />}
        </div>
      </div>
    </header>
  );
};
