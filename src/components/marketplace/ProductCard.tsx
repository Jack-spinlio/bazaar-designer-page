
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { ProductPreviewDialog, ProductDetails } from './ProductPreviewDialog';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  manufacturer: string;
  category?: string;
  customDesignUrl?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleCardClick = () => {
    setPreviewOpen(true);
  };
  
  const handleManufacturerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to the supplier profile
    navigate(`/supplier/${product.manufacturer.toLowerCase()}`);
  };
  
  // Determine which logo to use based on manufacturer
  const getLogo = () => {
    if (product.manufacturer.toLowerCase() === 'shimano') {
      return 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Shimano-Logo-1990.png';
    } else if (product.manufacturer.toLowerCase() === 'brakco') {
      return 'https://www.brakco.com/images/en/logo.svg';
    } else if (product.manufacturer.toLowerCase() === 'sram') {
      return 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Shimano-Logo-1990.png'; // Replace with actual SRAM logo when available
    }
    return 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//PHOTO-2025-01-16-17-11-25%202.jpg';
  };
    
  // Convert to ProductDetails format for the dialog
  const productDetails: ProductDetails = {
    ...product,
    rating: 4.5,
    reviewCount: 392,
    features: [
      { name: 'Quality Components' },
      { name: 'Precision Engineering' },
      { name: 'Durable Materials' },
    ],
    leadTime: '30 Day',
    moq: 50,
    origin: 'Taiwan',
    customDesignUrl: product.customDesignUrl
  };
  
  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer w-full bg-white border border-gray-100"
        onClick={handleCardClick}
      >
        <div className="h-36 overflow-hidden">
          {!imageError ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-t-lg"
              onError={(e) => {
                console.error("Failed to load product image:", product.image);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500 text-sm">Image not available</p>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-gray-900 line-clamp-2 h-10 text-sm mb-2 text-left">{product.name}</h3>
          <div 
            onClick={handleManufacturerClick}
            className="flex items-center gap-2 mb-2 cursor-pointer group"
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={getLogo()} alt={`${product.manufacturer} logo`} />
              <AvatarFallback>{product.manufacturer.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600 group-hover:text-blue-600 border-b border-gray-300 group-hover:border-blue-600">
              {product.manufacturer}
            </span>
          </div>
          <p className="font-semibold text-sm text-left">${product.price}</p>
        </CardContent>
      </Card>
      
      <ProductPreviewDialog 
        product={productDetails}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </>
  );
};
