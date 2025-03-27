import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

interface ProductFeature {
  name: string;
}

export interface ProductDetails {
  id: string;
  name: string;
  image: string;
  price: number;
  manufacturer: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  features?: ProductFeature[];
  leadTime?: string;
  moq?: number;
  origin?: string;
  customDesignUrl?: string;
}

interface ProductPreviewDialogProps {
  product: ProductDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductPreviewDialog: React.FC<ProductPreviewDialogProps> = ({
  product,
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  
  // Default product features if not provided
  const features = product.features || [
    { name: 'Handlebar Display' },
    { name: 'Integrated Lighting' },
    { name: 'Hydraulic Brakes' },
    { name: '700C' },
    { name: '15Ah Battery' },
  ];
  
  const handleCustomize = () => {
    // Check if product has a custom design URL
    if (product.customDesignUrl) {
      // Open external design URL in a new tab
      window.open(product.customDesignUrl, '_blank');
    } else {
      // Navigate to internal design studio with the selected product
      navigate(`/design?product=${product.id}`);
    }
    onOpenChange(false);
  };
  
  const handleViewDetails = () => {
    // Navigate to product details page
    navigate(`/product/${product.id}`);
    onOpenChange(false);
  };
  
  // Generate star rating display
  const renderRating = () => {
    const rating = product.rating || 4.5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < fullStars
                  ? 'text-yellow-400 fill-yellow-400'
                  : i === fullStars && hasHalfStar
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="font-medium">{rating}</span>
        <span className="text-gray-500">·</span>
        <span className="text-gray-600 hover:underline cursor-pointer">
          based on {product.reviewCount || 392} reviews
        </span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-3xl overflow-hidden">
        <div className="p-4">
          <button 
            onClick={() => onOpenChange(false)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <div className="md:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto object-contain aspect-square"
              />
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 space-y-4">
              <div>
                <div className="text-sm text-gray-500">
                  {product.category || 'eBikes'} / {product.manufacturer}
                </div>
                <h2 className="text-2xl font-bold mt-1">{product.name}</h2>
              </div>
              
              {renderRating()}
              
              {/* Product Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {features.map((feature, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="bg-gray-50 text-gray-800 hover:bg-gray-100 px-3 py-1 rounded-full"
                  >
                    {feature.name}
                  </Badge>
                ))}
              </div>
              
              {/* Price */}
              <div className="mt-6">
                <div className="text-gray-600">$</div>
                <div className="text-4xl font-bold">{product.price}</div>
              </div>
              
              {/* Draft designs */}
              <div className="flex items-center mt-6">
                <div className="flex -space-x-2 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-gray-600">124 draft designs</span>
              </div>
              
              {/* Product Information */}
              <div className="space-y-2 mt-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-gray-800" />
                  <span>Produced by: <span className="font-medium">{product.manufacturer}</span></span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-gray-800" />
                  <span>Manufactured in {product.origin || 'Taiwan'}</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-gray-800" />
                  <span>{product.leadTime || '90 Day'} Lead Time</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-gray-800" />
                  <span>MOQ: {product.moq || 100}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-4 mt-4 p-4 border-t border-gray-100">
          <Button 
            onClick={handleCustomize}
            className="flex-1 gap-2"
            size="lg"
          >
            <Plus className="w-5 h-5" /> Customise
          </Button>
          <Button 
            onClick={handleViewDetails}
            variant="outline" 
            className="flex-1"
            size="lg"
          >
            View Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
