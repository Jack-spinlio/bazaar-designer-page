
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    category: string;
    manufacturer: string;
    subcategory?: string;
    variants?: string[];
  };
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <AspectRatio ratio={4/3}>
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full rounded-t-lg"
        />
      </AspectRatio>
      <CardContent className="p-4 text-left">
        <div className="space-y-2">
          <h3 className="font-medium text-base text-left">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{product.category}</span>
            <span className="font-medium">${product.price}</span>
          </div>
          
          {product.subcategory && (
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="outline" className="text-xs">
                {product.subcategory}
              </Badge>
              
              {product.variants && product.variants.map(variant => (
                <Badge key={variant} variant="secondary" className="text-xs">
                  {variant}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between gap-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-8 text-xs px-2"
          asChild
        >
          <Link to={`/product/${product.id}`}>
            <Eye className="h-3.5 w-3.5 mr-1" />
            View
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 h-8 text-xs px-2"
          asChild
        >
          <Link to={`/supplier/edit/${product.id}`}>
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-8 text-xs px-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete && onDelete(product.id)}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
