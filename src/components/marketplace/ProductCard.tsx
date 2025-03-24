
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  manufacturer: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    // In a real app, this would navigate to the product detail page
    console.log(`Product clicked: ${product.name}`);
  };
  
  const handleManufacturerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would navigate to the manufacturer's profile
    console.log(`Manufacturer clicked: ${product.manufacturer}`);
  };
  
  // Determine which logo to use based on manufacturer
  const manufacturerLogo = product.manufacturer === 'Shimano' 
    ? 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Shimano-Logo-1990.png'
    : 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//PHOTO-2025-01-16-17-11-25%202.jpg';
    
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer w-full bg-white border border-gray-100"
      onClick={handleCardClick}
    >
      <div className="h-44 p-4 flex items-center justify-center bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain rounded-md"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 h-12 mb-2">{product.name}</h3>
        <div 
          onClick={handleManufacturerClick}
          className="flex items-center gap-2 mb-3 cursor-pointer group"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={manufacturerLogo} alt={`${product.manufacturer} logo`} />
            <AvatarFallback>{product.manufacturer.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600 group-hover:text-blue-600 border-b border-gray-300 group-hover:border-blue-600">
            {product.manufacturer}
          </span>
        </div>
        <p className="font-semibold text-lg">${product.price}</p>
      </CardContent>
    </Card>
  );
};
