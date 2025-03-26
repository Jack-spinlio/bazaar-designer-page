import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Exhibitor {
  id?: string;
  name: string;
  slug: string;
  booth_info?: string | null;
  address?: string | null;
  thumbnail_url?: string | null;
  products?: string | null;
  description?: string | null;
  telephone?: string | null;
  email?: string | null;
  website?: string | null;
  fax?: string | null;
}

interface ExhibitorCardProps {
  exhibitor: Exhibitor;
  className?: string;
}

const ExhibitorCard: React.FC<ExhibitorCardProps> = ({ exhibitor, className }) => {
  // Extract product keywords for badges
  const productKeywords = exhibitor.products 
    ? exhibitor.products
        .split(/[,;]/)
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0 && keyword.length < 20) // Filter out empty or too long keywords
        .slice(0, 3) // Show max 3 badges
    : [];
  
  // Limit description to 120 characters
  const shortDescription = exhibitor.description
    ? exhibitor.description.length > 120
      ? `${exhibitor.description.substring(0, 120)}...`
      : exhibitor.description
    : null;

  return (
    <Card className={cn("h-full flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
      <Link to={`/supplier/${exhibitor.slug}`} className="h-full flex flex-col">
        <div className="h-44 overflow-hidden bg-gray-100">
          {exhibitor.thumbnail_url ? (
            <img
              src={exhibitor.thumbnail_url}
              alt={exhibitor.name}
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400?text=No+Image+Available";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
      
        <CardHeader className="pb-2">
          <div className="text-xs font-medium text-gray-500 mb-1">
            {exhibitor.booth_info && `Booth: ${exhibitor.booth_info}`}
          </div>
          <h3 className="font-bold text-lg line-clamp-2 text-left">
            {exhibitor.name}
          </h3>
        </CardHeader>
      
        <CardContent className="flex-grow pb-2">
          {exhibitor.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2 text-left">
              {exhibitor.description}
            </p>
          )}
        </CardContent>
      
        <CardFooter className="pt-0 flex flex-wrap gap-1">
          {productKeywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="text-xs font-normal">
              {keyword}
            </Badge>
          ))}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ExhibitorCard; 