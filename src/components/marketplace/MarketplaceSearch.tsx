
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllSuppliers } from '@/utils/supplierData';
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
  onSearch: (query: string, category: string) => void;
}

export const MarketplaceSearch: React.FC<MarketplaceSearchProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch
}) => {
  const [supplierSuggestions, setSupplierSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();
  
  // Get all suppliers for suggestions
  useEffect(() => {
    const suppliers = getAllSuppliers();
    const supplierNames = suppliers.map(supplier => supplier.name);
    setSupplierSuggestions(supplierNames);
  }, []);
  
  // Handle selecting a supplier suggestion
  const handleSelectSupplier = (supplierName: string) => {
    const suppliers = getAllSuppliers();
    const selectedSupplier = suppliers.find(s => s.name === supplierName);
    
    if (selectedSupplier) {
      navigate(`/supplier/${selectedSupplier.id}`);
    }
  };
  
  // Handle search button click
  const handleSearch = () => {
    onSearch(searchQuery, selectedCategory);
  };
  
  return (
    <div className="flex w-full max-w-4xl mx-auto mt-4 rounded-full overflow-hidden border border-gray-200">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input 
          type="text" 
          placeholder="Search for bikes, components, or suppliers" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-0 rounded-l-full h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
          suggestions={supplierSuggestions}
          onSelectSuggestion={handleSelectSupplier}
        />
      </div>
      
      <Select defaultValue="all" onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[200px] border-0 border-l border-gray-200 rounded-none h-12 focus:ring-0">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="suppliers">Suppliers</SelectItem>
            <SelectItem value="ebikes">eBikes</SelectItem>
            <SelectItem value="roadbikes">Road Bikes</SelectItem>
            <SelectItem value="drivetrain">Drivetrain Components</SelectItem>
            <SelectItem value="ebikecomp">eBike Components</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <Button 
        className="rounded-none rounded-r-full h-12 px-8 bg-black text-white hover:bg-gray-800"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );
};
