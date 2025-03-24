
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
  category?: string;
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
    // Navigate to producer profile page
    navigate('/producer/shimano');
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
      <div className="h-36 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-gray-900 line-clamp-2 h-10 text-sm mb-2 text-left">{product.name}</h3>
        <div 
          onClick={handleManufacturerClick}
          className="flex items-center gap-2 mb-2 cursor-pointer group"
        >
          <Avatar className="h-5 w-5">
            <AvatarImage src={manufacturerLogo} alt={`${product.manufacturer} logo`} />
            <AvatarFallback>{product.manufacturer.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-600 group-hover:text-blue-600 border-b border-gray-300 group-hover:border-blue-600">
            {product.manufacturer}
          </span>
        </div>
        <p className="font-semibold text-sm text-left">${product.price}</p>
      </CardContent>
    </Card>
  );
};
