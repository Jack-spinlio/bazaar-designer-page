
import React from 'react';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  manufacturer: string;
}

interface ProductCategoryProps {
  title: string;
  products: Product[];
}

export const ProductCategory: React.FC<ProductCategoryProps> = ({ title, products }) => {
  const navigate = useNavigate();
  
  const handleViewAll = () => {
    // This would navigate to a category-specific page in a real app
    console.log(`View all clicked for: ${title}`);
  };
  
  // Only display the first 6 products
  const displayProducts = products.slice(0, 6);
  
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Button variant="ghost" className="text-gray-600 font-medium" onClick={handleViewAll}>
          View all
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
