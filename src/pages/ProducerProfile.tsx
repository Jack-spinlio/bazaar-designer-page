
import React, { useState } from 'react';
import { Header } from '@/components/Header/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Star, StarHalf, ChevronLeft, ChevronRight } from 'lucide-react';

// Product data with categories
const products = [{
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
}, {
  id: 'dt-5',
  name: 'Shimano Dura-Ace Calliper',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Dura-ace%20calliper.jpeg',
  price: 195,
  manufacturer: 'Shimano',
  category: 'braking'
}, {
  id: 'dt-6',
  name: 'Shimano GRX Pedals',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//GRX%20Pedals.jpeg',
  price: 95,
  manufacturer: 'Shimano',
  category: 'pedals'
}, {
  id: 'dt-7',
  name: 'Shimano XTR Derailleur',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//xrt%20di2%20deralier.jpeg',
  price: 210,
  manufacturer: 'Shimano',
  category: 'drivetrain'
}, {
  id: 'dt-8',
  name: 'Shimano XTR Lever',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//xtra%20lever.jpeg',
  price: 145,
  manufacturer: 'Shimano',
  category: 'braking'
}, {
  id: 'ebc-1',
  name: 'Shimano eBike Display',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//sim%20disp.jpeg',
  price: 182,
  manufacturer: 'Shimano',
  category: 'ebike'
}, {
  id: 'ebc-2',
  name: 'Shimano Steps 504Wh Battery',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//504wh.jpeg',
  price: 435,
  manufacturer: 'Shimano',
  category: 'ebike'
}, {
  id: 'ebc-3',
  name: 'Shimano 630Wh Battery',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//630wh.jpeg',
  price: 520,
  manufacturer: 'Shimano',
  category: 'ebike'
}, {
  id: 'ebc-6',
  name: 'Shimano EP8 Motor',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//EP8.jpeg',
  price: 610,
  manufacturer: 'Shimano',
  category: 'ebike'
}];

// Gallery images - updated with the new URLs
const galleryImages = [{
  id: 1,
  url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//shimano.avif',
  alt: 'Shimano Workshop'
}, {
  id: 2,
  url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//vulz%20factory%20.jpg',
  alt: 'Vulz Factory'
}, {
  id: 3,
  url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//vulz33.jpeg',
  alt: 'Vulz Facility'
}, {
  id: 4,
  url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//vulz22.jpeg',
  alt: 'Vulz Equipment'
}];

const ProducerProfile = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featuredImage, setFeaturedImage] = useState<string>(galleryImages[0].url);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' ? products : products.filter(product => product.category === selectedCategory);

  // Limit products to 6 per row
  const displayedProducts = filteredProducts.slice(0, 6);
  const categories = [{
    id: 'all',
    name: 'All Products'
  }, {
    id: 'drivetrain',
    name: 'Drivetrain'
  }, {
    id: 'braking',
    name: 'Braking Systems'
  }, {
    id: 'wheels',
    name: 'Wheels & Hubs'
  }, {
    id: 'pedals',
    name: 'Pedals'
  }, {
    id: 'ebike',
    name: 'eBike Components'
  }];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    setFeaturedImage(galleryImages[(currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1)].url);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    setFeaturedImage(galleryImages[(currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1)].url);
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Top Section: Producer Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Left side - Company info */}
          <div className="w-full md:w-1/3">
            <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Shimano-Logo-1990.png" alt="Shimano Logo" className="w-48 h-auto object-contain mb-4" />
            <p className="text-lg text-gray-600 mb-2 text-left">OEM Component Producer</p>
            <h1 className="text-4xl font-bold mb-3 text-left">Shimano Inc, Japan</h1>
            <div className="flex items-center mb-2">
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <StarHalf className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <span className="ml-2 text-gray-600">4.5 Bazaar Rating</span>
            </div>
          </div>
          
          {/* Right side - Featured image with thumbnails */}
          <div className="w-full md:w-2/3">
            {/* Gallery container to maintain equal width */}
            <div className="flex flex-col space-y-4">
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
                  {galleryImages.slice(0, 3).map((image, index) => (
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
              <h3 className="text-lg font-semibold mb-3">About Shimano</h3>
              <p className="text-gray-700">
                Shimano Inc. is a Japanese multinational manufacturer of cycling components, fishing tackle, and rowing equipment. Shimano produces components for road, mountain, and hybrid bikes, including drivetrains, brakes, wheels, pedals, and cycling shoes and clothing.
              </p>
              <p className="text-gray-700 mt-3">
                Shimano's component designs are known worldwide and used by professional cyclists and everyday riders alike.
              </p>
            </TabsContent>
            <TabsContent value="social" className="p-4 bg-white rounded-xl shadow-sm text-left">
              <h3 className="text-lg font-semibold mb-3">Social Media</h3>
              <p className="text-gray-700">
                Follow Shimano on social media for the latest product announcements and cycling news.
              </p>
              <ul className="list-disc pl-5 text-gray-700 mt-3">
                <li className="mb-2">Instagram: @shimanoofficial</li>
                <li className="mb-2">Facebook: Shimano</li>
                <li className="mb-2">Twitter: @ShimanoEurope</li>
                <li className="mb-2">YouTube: Shimano</li>
              </ul>
            </TabsContent>
            <TabsContent value="certifications" className="p-4 bg-white rounded-xl shadow-sm text-left">
              <h3 className="text-lg font-semibold mb-3">Certifications</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li className="mb-2">ISO 9001:2015 Quality Management</li>
                <li className="mb-2">ISO 14001:2015 Environmental Management</li>
                <li className="mb-2">OHSAS 18001 Health and Safety Management</li>
                <li className="mb-2">UCI Approved Equipment Manufacturer</li>
              </ul>
            </TabsContent>
            <TabsContent value="contact" className="p-4 bg-white rounded-xl shadow-sm text-left">
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
              {categories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${selectedCategory === category.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                  {category.name}
                </button>)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {displayedProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          
          {filteredProducts.length > 6 && <div className="mt-4 text-center">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                View All ({filteredProducts.length})
              </button>
            </div>}
        </div>
      </div>
    </div>
  );
};

export default ProducerProfile;
