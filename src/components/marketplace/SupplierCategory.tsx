
import React from 'react';
import { SupplierCard } from './SupplierCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Supplier {
  id: string;
  name: string;
  logoUrl: string;
  shortDescription: string;
}

interface SupplierCategoryProps {
  title: string;
  suppliers: Supplier[];
}

export const SupplierCategory: React.FC<SupplierCategoryProps> = ({ title, suppliers }) => {
  const navigate = useNavigate();
  
  const handleViewAll = () => {
    // This would navigate to a suppliers listing page in a real app
    console.log(`View all clicked for: ${title}`);
  };
  
  // Only display the first 6 suppliers
  const displaySuppliers = suppliers.slice(0, 6);
  
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Button variant="ghost" className="text-gray-600 font-medium" onClick={handleViewAll}>
          View all
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {displaySuppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
};
