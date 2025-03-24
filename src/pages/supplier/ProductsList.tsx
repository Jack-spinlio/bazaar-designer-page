
import React, { useState } from 'react';
import { ProductCard } from '@/components/supplier/ProductCard';
import { Input } from '@/components/ui/input';
import { Search, ArrowDownAZ, ArrowDownZA } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Product data with categories - this would typically come from an API/database
const initialProducts = [{
  id: 'dt-1',
  name: 'Shimano 105 Front Calliper',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20front%20calliper.jpeg',
  price: 55,
  manufacturer: 'Shimano',
  category: 'drivetrain'
}, {
  id: 'dt-2',
  name: 'Shimano 105 Rear Hub',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20hub.jpeg',
  price: 89,
  manufacturer: 'Shimano',
  category: 'wheels'
}, {
  id: 'dt-3',
  name: 'Shimano XTR Cassette',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//cassette.jpeg',
  price: 112,
  manufacturer: 'Shimano',
  category: 'drivetrain'
}, {
  id: 'dt-4',
  name: 'Shimano CUES Road Bike Lever',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//CUES%20lever.jpeg',
  price: 78,
  manufacturer: 'Shimano',
  category: 'braking'
}];

export const ProductsList: React.FC = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products by name
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success('Product deleted successfully');
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Products</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products by name or category..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={toggleSortOrder}
        >
          {sortOrder === 'asc' ? 
            <ArrowDownAZ className="mr-2 h-4 w-4" /> : 
            <ArrowDownZA className="mr-2 h-4 w-4" />
          }
          {sortOrder === 'asc' ? 'A to Z' : 'Z to A'}
        </Button>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products found. Try a different search term or add a new product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
