import React, { useState } from 'react';
import { ProductCategory } from '@/components/marketplace/ProductCategory';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';

// Bike products
const eBikes = [
  {
    id: 'ebike-1',
    name: 'Mens Smart eBike',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//2.jpg',
    price: 1160,
    manufacturer: 'Vulz'
  },
  {
    id: 'ebike-2',
    name: 'Sensations eGravel Bike',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//7.jpg',
    price: 1347,
    manufacturer: 'Vulz'
  },
  {
    id: 'ebike-3',
    name: 'Urban Beauty',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//8.jpg',
    price: 980,
    manufacturer: 'Vulz'
  },
  {
    id: 'ebike-4',
    name: 'Mens Smart eBike',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//4.jpg',
    price: 1222,
    manufacturer: 'Vulz'
  },
  {
    id: 'ebike-5',
    name: 'RitBlazer 2170',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//5.jpg',
    price: 1120,
    manufacturer: 'Vulz'
  },
  {
    id: 'ebike-6',
    name: 'Urban Cloud Chaser',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//3.jpg',
    price: 815,
    manufacturer: 'Vulz'
  }
];

// Drivetrain components with updated images
const drivetrainComponents = [
  {
    id: 'dt-1',
    name: 'Shimano 105 Front Calliper',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20front%20calliper.jpeg',
    price: 55,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-2',
    name: 'Shimano 105 Rear Hub',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20hub.jpeg',
    price: 89,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-3',
    name: 'Shimano XTR Cassette',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//cassette.jpeg',
    price: 112,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-4',
    name: 'Shimano CUES Road Bike Lever',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//CUES%20lever.jpeg',
    price: 78,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-5',
    name: 'Shimano Dura-Ace Calliper',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Dura-ace%20calliper.jpeg',
    price: 195,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-6',
    name: 'Shimano GRX Pedals',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//GRX%20Pedals.jpeg',
    price: 95,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-7',
    name: 'Shimano XTR Derailleur',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//xrt%20di2%20deralier.jpeg',
    price: 210,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-8',
    name: 'Shimano XTR Lever',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//xtra%20lever.jpeg',
    price: 145,
    manufacturer: 'Shimano'
  }
];

// Road bikes
const roadBikes = [
  {
    id: 'rb-1',
    name: 'Racing Bike',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Screenshot%202025-03-21%20at%2011.56.56.png',
    price: 1160,
    manufacturer: 'Vulz'
  },
  {
    id: 'rb-2',
    name: 'Classic Racer',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//6.jpg',
    price: 650,
    manufacturer: 'Vulz'
  },
  {
    id: 'rb-3',
    name: 'Mens Road Bike',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//9.jpg',
    price: 430,
    manufacturer: 'Vulz'
  },
  {
    id: 'rb-4',
    name: 'Road Bike -35mm Deep Rim',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//2.jpg',
    price: 810,
    manufacturer: 'Vulz'
  },
  {
    id: 'rb-5',
    name: 'Womens Racer',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//3.jpg',
    price: 775,
    manufacturer: 'Vulz'
  },
  {
    id: 'rb-6',
    name: 'Low Cost Road Bike',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//7.jpg',
    price: 511,
    manufacturer: 'Vulz'
  },
  {
    id: 'rb-7',
    name: 'Pro Tour Edition',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//4.jpg',
    price: 899,
    manufacturer: 'Vulz'
  }
];

// eBike components with updated images
const eBikeComponents = [
  {
    id: 'ebc-1',
    name: 'Shimano eBike Display',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//sim%20disp.jpeg',
    price: 182,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-2',
    name: 'Shimano Steps 504Wh Battery',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//504wh.jpeg',
    price: 435,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-3',
    name: 'Shimano 630Wh Battery',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//630wh.jpeg',
    price: 520,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-4',
    name: 'Shimano Di2 Switch',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Di2%20Switch.jpeg',
    price: 85,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-5',
    name: 'Shimano STEPS Switch',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//disp.jpeg',
    price: 95,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-6',
    name: 'Shimano EP8 Motor',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//EP8.jpeg',
    price: 610,
    manufacturer: 'Shimano'
  }
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="bg-white min-h-screen w-full">
      <MarketplaceHeader />
      
      <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <MarketplaceSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <div className="mt-8 space-y-12">
          <ProductCategory 
            title="eBikes" 
            products={eBikes} 
          />
          
          <ProductCategory 
            title="Drivetrain Components" 
            products={drivetrainComponents} 
          />
          
          <ProductCategory 
            title="Road Bikes" 
            products={roadBikes} 
          />
          
          <ProductCategory 
            title="eBike Components" 
            products={eBikeComponents} 
          />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
