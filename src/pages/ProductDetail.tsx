
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

// This is a simplified version of what would normally come from a database
const getProductById = (id: string) => {
  const allProducts = [
    // eBikes
    {
      id: 'ebike-1',
      name: "Men's Urban eBike",
      image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//2.jpg',
      price: 1150,
      manufacturer: 'Vulz',
      rating: 4.5,
      origin: 'Taiwan',
      features: [
        '8-speed gearing for versatility across city streets and open roads',
        'Disc brakes for powerful stopping in all weather conditions',
        'Lightweight alloy frame for a smooth, agile ride',
        'Comfortable geometry designed for daily commutes and long rides',
        'Durable wheels & puncture-resistant tires for added reliability',
        'Internal cable routing for a sleek, clean look',
        'Wide handlebars for better control and stability',
        'Ergonomic saddle & grips for all-day comfort',
        'Customizable color options to match your style',
        'Low-maintenance drivetrain keeps things simple and efficient',
        'Perfect balance of speed, comfort, and control for urban riders'
      ],
      highlights: [
        'Shimano Components',
        'European Service Centre',
        'Ships 75% Assembled'
      ],
      draftCount: 1241,
      category: 'eBikes',
      images: [
        'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//2.jpg',
        'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//3.jpg',
        'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//4.jpg'
      ]
    },
    // More products would be added here
  ];
  
  return allProducts.find(product => product.id === id);
};

// Similar products data
const similarProducts = [
  {
    id: 'gravel-1',
    name: 'eGravel Bike',
    manufacturer: 'Golden Wheel',
    price: 1390,
    rating: 4.5,
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//7.jpg'
  },
  {
    id: 'road-1',
    name: 'Disc Brake Road Bike',
    manufacturer: 'Evergrand',
    price: 371,
    rating: 4.8,
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//8.jpg'
  },
  {
    id: 'road-2',
    name: 'Road Bike',
    manufacturer: 'Kenstone',
    price: 280,
    rating: 4.9,
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//9.jpg'
  },
  {
    id: 'carbon-1',
    name: 'Carbon bike',
    manufacturer: 'Evergrand',
    price: 867,
    rating: 4.2,
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//5.jpg'
  },
  {
    id: 'road-3',
    name: 'Road Bike',
    manufacturer: 'Kenstone',
    price: 289.90,
    rating: 4.7,
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//3.jpg'
  }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const product = getProductById(id || '');
  
  if (!product) {
    return <div className="p-8 text-center">Product not found</div>;
  }
  
  const handleCustomize = () => {
    navigate(`/design?product=${product.id}`);
  };
  
  // Generate star rating display
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
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
    );
  };
  
  return (
    <div className="bg-white h-screen w-full overflow-y-auto">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bazaar</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute -right-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
              <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//PHOTO-2025-01-16-17-11-25%202.jpg" alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20">
        <Link 
          to="/marketplace" 
          className="flex items-center text-sm text-gray-600 mb-4 hover:text-gray-900"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mr-2">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to previous page | Listed in : <span className="text-blue-600 ml-1">eBikes</span>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product images section */}
          <div>
            <div className="bg-gray-100 rounded-md overflow-hidden mb-4 h-96">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
            
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index} className="basis-1/3">
                    <div className="bg-gray-100 rounded-md overflow-hidden h-24 p-2">
                      <img 
                        src={image} 
                        alt={`${product.name} view ${index + 1}`} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
          
          {/* Product details section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-1">Produced by: {product.manufacturer}</p>
            
            <div className="flex items-center gap-2 mt-2">
              {renderRating(product.rating)}
              <span className="font-medium">{product.rating}</span>
              <span className="text-gray-600">Supplier Rating</span>
            </div>
            
            <div className="mt-6">
              <div className="text-gray-500 text-sm">$</div>
              <div className="text-4xl font-bold">{product.price}</div>
            </div>
            
            <div className="mt-6 space-y-3">
              {product.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-gray-800" />
                  <span>{highlight}</span>
                </div>
              ))}
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-gray-800" />
                <span>Manufactured in {product.origin}</span>
              </div>
            </div>
            
            <div className="flex items-center mt-6">
              <div className="flex -space-x-2 mr-3">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-gray-600">{product.draftCount} draft designs</span>
            </div>
            
            <div className="mt-8 flex gap-4">
              <Button 
                onClick={handleCustomize}
                className="flex-1 bg-black hover:bg-gray-800 text-white"
              >
                Customise
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
              >
                Contact Supplier
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <Tabs defaultValue="about">
            <TabsList className="bg-transparent border-b border-gray-200 w-full flex justify-start space-x-8 px-0">
              <TabsTrigger 
                value="about"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-0"
              >
                About
              </TabsTrigger>
              <TabsTrigger 
                value="components"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-0"
              >
                Components
              </TabsTrigger>
              <TabsTrigger 
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-0"
              >
                Shipping
              </TabsTrigger>
              <TabsTrigger 
                value="warranty"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-0"
              >
                Warranty
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-8">
              <div className="flex md:flex-row flex-col gap-8">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="max-h-48 object-contain" 
                    />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gray-600 mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="components">
              <div className="py-8 text-center text-gray-500">
                Component details coming soon
              </div>
            </TabsContent>
            
            <TabsContent value="shipping">
              <div className="py-8 text-center text-gray-500">
                Shipping information coming soon
              </div>
            </TabsContent>
            
            <TabsContent value="warranty">
              <div className="py-8 text-center text-gray-500">
                Warranty details coming soon
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Similar items</h2>
            <button className="text-gray-600 hover:text-gray-900">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {similarProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-40 bg-gray-100">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.manufacturer}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="font-bold">${product.price}</p>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
