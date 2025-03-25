
import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/supplier/ProductCard';
import { Input } from '@/components/ui/input';
import { Search, ArrowDownAZ, ArrowDownZA, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  manufacturer: string;
  category: string;
  thumbnail_url?: string; // Make thumbnail_url optional to match our usage
}

export const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to view your products');
        return;
      }
      
      // Get products with their categories
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, 
          name, 
          price, 
          manufacturer, 
          thumbnail_url,
          categories:category_id (name)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Transform the data to match our component's expected format
      const formattedProducts = data.map(item => ({
        id: item.id,
        name: item.name,
        image: item.thumbnail_url || 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//placeholder.svg',
        price: parseFloat(item.price.toString()), // Convert to number properly
        manufacturer: item.manufacturer,
        category: item.categories?.name || 'Uncategorized',
        thumbnail_url: item.thumbnail_url // Add this to match the interface
      }));
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="text-left">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Products</h1>
        <Button asChild className="bg-black hover:bg-black/90">
          <Link to="/supplier/upload">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading products...</p>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No products found. {searchTerm ? 'Try a different search term' : 'Add your first product to get started.'}</p>
          {!searchTerm && (
            <Button asChild>
              <Link to="/supplier/upload">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Link>
            </Button>
          )}
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
