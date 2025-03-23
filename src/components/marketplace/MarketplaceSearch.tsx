
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarketplaceSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const MarketplaceSearch: React.FC<MarketplaceSearchProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="flex w-full max-w-4xl mx-auto mt-4 rounded-full overflow-hidden border border-gray-200">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input 
          type="text" 
          placeholder="Search for bikes and components" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-0 rounded-l-full h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      
      <Select defaultValue="all">
        <SelectTrigger className="w-[200px] border-0 border-l border-gray-200 rounded-none h-12 focus:ring-0">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="ebikes">eBikes</SelectItem>
            <SelectItem value="roadbikes">Road Bikes</SelectItem>
            <SelectItem value="drivetrain">Drivetrain Components</SelectItem>
            <SelectItem value="ebikecomp">eBike Components</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <Button className="rounded-none rounded-r-full h-12 px-8 bg-black text-white hover:bg-gray-800">
        Search
      </Button>
    </div>
  );
};
