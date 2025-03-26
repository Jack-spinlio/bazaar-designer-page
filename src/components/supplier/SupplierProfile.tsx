
import React, { useState } from 'react';
import { Header } from '@/components/Header/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Star, StarHalf, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'react-router-dom';

// Types for our supplier data
export interface SupplierProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  manufacturer: string;
  category: string;
  subcategory?: string;
  variants?: string[];
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
}

export interface CategoryType {
  id: string;
  name: string;
}

export interface SupplierData {
  id: string;
  name: string;
  shortDescription: string;
  logoUrl: string;
  rating: number;
  type: string;
  information: string;
  socialMedia: {
    platform: string;
    handle: string;
  }[];
  certifications: string[];
  contact: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  products: SupplierProduct[];
  gallery: GalleryImage[];
  categories: CategoryType[];
}

interface SupplierProfileProps {
  supplierData: SupplierData;
}

export const SupplierProfile: React.FC<SupplierProfileProps> = ({ supplierData }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featuredImage, setFeaturedImage] = useState<string>(supplierData.gallery[0]?.url || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? supplierData.products 
    : supplierData.products.filter(product => product.category === selectedCategory);

  // Limit products to 6 per row
  const displayedProducts = filteredProducts.slice(0, 6);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? supplierData.gallery.length - 1 : prev - 1));
    setFeaturedImage(supplierData.gallery[(currentImageIndex === 0 ? supplierData.gallery.length - 1 : currentImageIndex - 1)].url);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === supplierData.gallery.length - 1 ? 0 : prev + 1));
    setFeaturedImage(supplierData.gallery[(currentImageIndex === supplierData.gallery.length - 1 ? 0 : currentImageIndex + 1)].url);
  };

  return (
    <div className="h-screen w-full overflow-y-auto">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-20">
        {/* Top Section: Producer Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Left side - Company info */}
          <div className="w-full md:w-1/3">
            <img src={supplierData.logoUrl} alt={`${supplierData.name} Logo`} className="w-48 h-auto object-contain mb-4" />
            <p className="text-lg text-gray-600 mb-2 text-left">{supplierData.type}</p>
            <h1 className="text-4xl font-bold mb-3 text-left">{supplierData.name}</h1>
            <div className="flex items-center mb-2">
              {[...Array(Math.floor(supplierData.rating))].map((_, i) => (
                <Star key={`star-${i}`} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              ))}
              {supplierData.rating % 1 !== 0 && (
                <StarHalf className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              )}
              <span className="ml-2 text-gray-600">{supplierData.rating} Bazaar Rating</span>
            </div>
          </div>
          
          {/* Right side - Featured image with thumbnails */}
          <div className="w-full md:w-2/3 flex justify-center">
            {/* Gallery container with max width */}
            <div className="flex flex-col space-y-4 max-w-[70%]">
              {/* Main image */}
              <div className="rounded-lg overflow-hidden h-72 w-full">
                <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
              </div>
              
              {/* Thumbnails row with navigation */}
              <div className="relative flex items-center">
                {/* Navigation buttons */}
                <button 
                  onClick={handlePrevImage}
                  className="absolute -left-4 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-gray-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <div className="w-full grid grid-cols-3 gap-4">
                  {supplierData.gallery.slice(0, 3).map((image, index) => (
                    <div 
                      key={image.id} 
                      className={`rounded-lg overflow-hidden cursor-pointer h-24 transition-all ${currentImageIndex === index ? 'ring-2 ring-black' : ''}`}
                      onClick={() => {
                        setFeaturedImage(image.url);
                        setCurrentImageIndex(index);
                      }}
                    >
                      <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleNextImage}
                  className="absolute -right-4 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-gray-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation Section */}
        <div className="mb-8">
          <Tabs defaultValue="information">
            <TabsList className="flex mb-6 p-1 bg-gray-100 rounded-lg">
              <TabsTrigger 
                value="information" 
                className="px-8 py-3 rounded-md data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
              >
                Information
              </TabsTrigger>
              <TabsTrigger 
                value="social" 
                className="px-8 py-3 rounded-md data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
              >
                Social Media
              </TabsTrigger>
              <TabsTrigger 
                value="certifications" 
                className="px-8 py-3 rounded-md data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
              >
                Certifications
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                className="px-8 py-3 rounded-md data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
              >
                Contact
              </TabsTrigger>
            </TabsList>
            <TabsContent value="information" className="p-4 bg-white rounded-xl shadow-sm text-left">
              <h3 className="text-lg font-semibold mb-3">About {supplierData.name}</h3>
              <p className="text-gray-700">{supplierData.information}</p>
            </TabsContent>
            <TabsContent value="social" className="p-4 bg-white rounded-xl shadow-sm text-left">
              <h3 className="text-lg font-semibold mb-3">Social Media</h3>
              <p className="text-gray-700">
                Follow {supplierData.name} on social media for the latest product announcements.
              </p>
              <ul className="list-disc pl-5 text-gray-700 mt-3">
                {supplierData.socialMedia.map((social, index) => (
                  <li key={index} className="mb-2">{social.platform}: {social.handle}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="certifications" className="p-4 bg-white rounded-xl shadow-sm text-left">
              <h3 className="text-lg font-semibold mb-3">Certifications</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {supplierData.certifications.map((cert, index) => (
                  <li key={index} className="mb-2">{cert}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="contact" className="p-4 bg-white rounded-xl shadow-sm text-left">
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <div className="text-gray-700">
                <p className="mb-2"><strong>Address:</strong> {supplierData.contact.address}</p>
                <p className="mb-2"><strong>Phone:</strong> {supplierData.contact.phone}</p>
                <p className="mb-2"><strong>Email:</strong> {supplierData.contact.email}</p>
                <p className="mb-2"><strong>Website:</strong> {supplierData.contact.website}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Product Listings */}
        <div>
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-3">
              {supplierData.categories.map(category => (
                <button 
                  key={category.id} 
                  onClick={() => setSelectedCategory(category.id)} 
                  className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${
                    selectedCategory === category.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {displayedProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          
          {filteredProducts.length > 6 && (
            <div className="mt-4 text-center">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                View All ({filteredProducts.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
