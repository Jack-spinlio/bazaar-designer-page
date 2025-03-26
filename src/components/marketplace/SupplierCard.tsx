
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface SupplierCardProps {
  supplier: {
    id: string;
    name: string;
    logoUrl: string;
    shortDescription: string;
  };
}

export const SupplierCard: React.FC<SupplierCardProps> = ({ supplier }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/supplier/${supplier.id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer w-full bg-white border border-gray-100"
      onClick={handleClick}
    >
      <div className="h-36 flex items-center justify-center p-4 bg-gray-50">
        <img 
          src={supplier.logoUrl} 
          alt={supplier.name} 
          className="max-h-28 max-w-full object-contain"
        />
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-gray-900 line-clamp-2 h-10 text-sm mb-2 text-left">{supplier.name}</h3>
        <p className="text-xs text-gray-600 line-clamp-2">{supplier.shortDescription}</p>
      </CardContent>
    </Card>
  );
};
