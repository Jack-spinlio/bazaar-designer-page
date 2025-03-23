
import React from 'react';
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
  
  const manufacturerInitials = product.manufacturer
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
    
  return (
    <div 
      className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="h-40 bg-white p-2 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h3>
        <div className="flex items-center mt-1 mb-1">
          <Avatar className="h-5 w-5 mr-1">
            <AvatarImage src={`https://avatar.vercel.sh/${product.manufacturer}.png`} />
            <AvatarFallback className="text-[10px]">{manufacturerInitials}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500">Produced by: {product.manufacturer}</span>
        </div>
        <p className="font-semibold text-sm">${product.price}</p>
      </div>
    </div>
  );
};
