
import React, { useState } from 'react';
import { Header } from '@/components/Header/Header';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Star, StarHalf } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Product data with categories
const products = [
  {
    id: 'dt-1',
    name: 'Shimano 105 Front Calliper',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20front%20calliper.jpeg',
    price: 55,
    manufacturer: 'Shimano',
    category: 'drivetrain'
  },
  {
    id: 'dt-2',
    name: 'Shimano 105 Rear Hub',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20hub.jpeg',
    price: 89,
    manufacturer: 'Shimano',
    category: 'wheels'
  },
  {
    id: 'dt-3',
    name: 'Shimano XTR Cassette',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//cassette.jpeg',
    price: 112,
    manufacturer: 'Shimano',
    category: 'drivetrain'
  },
  {
    id: 'dt-4',
    name: 'Shimano CUES Road Bike Lever',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//CUES%20lever.jpeg',
    price: 78,
    manufacturer: 'Shimano',
    category: 'braking'
  },
  {
    id: 'dt-5',
    name: 'Shimano Dura-Ace Calliper',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Dura-ace%20calliper.jpeg',
    price: 195,
    manufacturer: 'Shimano',
    category: 'braking'
  },
  {
    id: 'dt-6',
    name: 'Shimano GRX Pedals',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//GRX%20Pedals.jpeg',
    price: 95,
    manufacturer: 'Shimano',
    category: 'pedals'
  },
  {
    id: 'dt-7',
    name: 'Shimano XTR Derailleur',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//xrt%20di2%20deralier.jpeg',
    price: 210,
    manufacturer: 'Shimano',
    category: 'drivetrain'
  },
  {
    id: 'dt-8',
    name: 'Shimano XTR Lever',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//xtra%20lever.jpeg',
    price: 145,
    manufacturer: 'Shimano',
    category: 'braking'
  },
  {
    id: 'ebc-1',
    name: 'Shimano eBike Display',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//sim%20disp.jpeg',
    price: 182,
    manufacturer: 'Shimano',
    category: 'ebike'
  },
  {
    id: 'ebc-2',
    name: 'Shimano Steps 504Wh Battery',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//504wh.jpeg',
    price: 435,
    manufacturer: 'Shimano',
    category: 'ebike'
  },
  {
    id: 'ebc-3',
    name: 'Shimano 630Wh Battery',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//630wh.jpeg',
    price: 520,
    manufacturer: 'Shimano',
    category: 'ebike'
  },
  {
    id: 'ebc-6',
    name: 'Shimano EP8 Motor',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//EP8.jpeg',
    price: 610,
    manufacturer: 'Shimano',
    category: 'ebike'
  }
];

// Gallery images
const galleryImages = [
  {
    id: 1,
    url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//image.png',
    alt: 'Shimano Workshop',
  },
  {
    id: 2,
    url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//PHOTO-2025-01-16-17-11-25%202.jpg',
    alt: 'Shimano Factory',
  },
  {
    id: 3,
    url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Screenshot%202025-03-21%20at%2011.56.56.png',
    alt: 'Shimano Products',
  }
];

const ProducerProfile = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featuredImage, setFeaturedImage] = useState<string>(galleryImages[0].url);
  
  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'drivetrain', name: 'Drivetrain' },
    { id: 'braking', name: 'Braking Systems' },
    { id: 'wheels', name: 'Wheels & Hubs' },
    { id: 'pedals', name: 'Pedals' },
    { id: 'ebike', name: 'eBike Components' },
  ];
  
  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Top Section: Producer Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <img 
              src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Shimano-Logo-1990.png" 
              alt="Shimano Logo" 
              className="w-40 h-auto object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold mb-1">Shimano Inc, Japan</h1>
              <div className="flex items-center mb-1">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <StarHalf className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-1.5 text-gray-600">4.5 Bazaar Rating</span>
              </div>
              <p className="text-gray-600">OEM Component Producer</p>
            </div>
          </div>
        </div>
        
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="rounded-xl overflow-hidden mb-4 h-64">
            <img 
              src={featuredImage} 
              alt="Featured" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {galleryImages.map((image) => (
                <CarouselItem key={image.id} className="basis-1/4">
                  <div className="p-1">
                    <div 
                      className="rounded-xl overflow-hidden cursor-pointer h-24"
                      onClick={() => setFeaturedImage(image.url)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.alt} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        
        {/* Tab Navigation Section */}
        <div className="mb-8">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="p-4 bg-white rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-3">About Shimano</h3>
              <p className="text-gray-700">
                Shimano Inc. is a Japanese multinational manufacturer of cycling components, fishing tackle, and rowing equipment. Shimano produces components for road, mountain, and hybrid bikes, including drivetrains, brakes, wheels, pedals, and cycling shoes and clothing.
              </p>
              <p className="text-gray-700 mt-3">
                Shimano's component designs are known worldwide and used by professional cyclists and everyday riders alike.
              </p>
            </TabsContent>
            <TabsContent value="certifications" className="p-4 bg-white rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Certifications</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li className="mb-2">ISO 9001:2015 Quality Management</li>
                <li className="mb-2">ISO 14001:2015 Environmental Management</li>
                <li className="mb-2">OHSAS 18001 Health and Safety Management</li>
                <li className="mb-2">UCI Approved Equipment Manufacturer</li>
              </ul>
            </TabsContent>
            <TabsContent value="contact" className="p-4 bg-white rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <div className="text-gray-700">
                <p className="mb-2"><strong>Address:</strong> 3-77 Oimatsu-cho, Sakai-ku, Sakai City, Osaka, Japan</p>
                <p className="mb-2"><strong>Phone:</strong> +81-72-223-3957</p>
                <p className="mb-2"><strong>Email:</strong> info@shimano.com</p>
                <p className="mb-2"><strong>Website:</strong> www.shimano.com</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Product Listings */}
        <div>
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerProfile;
