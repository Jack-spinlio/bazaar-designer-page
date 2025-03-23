
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
  
  const handleManufacturerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would navigate to the manufacturer's profile
    console.log(`Manufacturer clicked: ${product.manufacturer}`);
  };
  
  // Determine which logo to use based on manufacturer
  const manufacturerLogo = product.manufacturer === 'Shimano' 
    ? 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Shimano-Logo-1990.png'
    : 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//PHOTO-2025-01-16-17-11-25%202.jpg';
  
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
        <div 
          onClick={handleManufacturerClick}
          className="flex items-center mt-1 mb-1 cursor-pointer border-b border-gray-300 pb-1 w-fit"
        >
          <img 
            src={manufacturerLogo} 
            alt={`${product.manufacturer} logo`} 
            className="h-5 mr-1 object-contain"
          />
        </div>
        <p className="font-semibold text-sm">${product.price}</p>
      </div>
    </div>
  );
};
