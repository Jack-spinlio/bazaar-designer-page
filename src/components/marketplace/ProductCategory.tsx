
import React from 'react';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';

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
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Button variant="ghost" className="text-gray-600 font-medium">
          View all
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
