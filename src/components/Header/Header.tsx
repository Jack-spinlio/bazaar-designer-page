
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
import { DesignTitle } from './DesignTitle';
import { SharePopover } from './SharePopover';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 z-10 bg-white rounded-2xl shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Bazaar</h1>
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
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          
          <SharePopover />
        </div>
      </div>
    </header>
  );
};
