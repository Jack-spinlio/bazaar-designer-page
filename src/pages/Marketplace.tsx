
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
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

// Drivetrain components
const drivetrainComponents = [
  {
    id: 'dt-1',
    name: 'VX4200 Chain',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//chain.jpg',
    price: 21,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-2',
    name: 'Shimano GRX Brake',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//brake.jpg',
    price: 58,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-3',
    name: 'Shimano Deore Derailleur',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//derailleur.jpg',
    price: 18,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-4',
    name: '105 Rear Hub',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//hub.jpg',
    price: 42,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-5',
    name: 'XTR 12 Speed Cassette',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//cassette.jpg',
    price: 24,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-6',
    name: 'XTR Crankset',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//crank.jpg',
    price: 21,
    manufacturer: 'Shimano'
  }
];

// Road bikes
const roadBikes = [
  {
    id: 'rb-1',
    name: 'Racing Bike',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//1.jpg',
    price: 1160,
    manufacturer: 'Gravity Bikes'
  },
  {
    id: 'rb-2',
    name: 'Classic Racer',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//6.jpg',
    price: 650,
    manufacturer: 'Zheju Moby'
  },
  {
    id: 'rb-3',
    name: 'Mens Road Bike',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//9.jpg',
    price: 430,
    manufacturer: 'EverGreen'
  },
  {
    id: 'rb-4',
    name: 'Road Bike -35mm Deep Rim',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//2.jpg',
    price: 810,
    manufacturer: 'Hangzhou Exp'
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
    manufacturer: 'Hangzhou Exp'
  }
];

// eBike components
const eBikeComponents = [
  {
    id: 'ebc-1',
    name: '602Wh External Battery',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//battery.jpg',
    price: 182,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-2',
    name: 'Shimano GRX Brake',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//controller.jpg',
    price: 58,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-3',
    name: 'Shimano GRX Shifter',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//shifter.jpg',
    price: 18,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-4',
    name: 'PW-250W Front Hub',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//motor.jpg',
    price: 42,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-5',
    name: '270x50 HDI Display',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//display.jpg',
    price: 24,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-6',
    name: 'Di2 Button',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//button.jpg',
    price: 11,
    manufacturer: 'Shimano'
  }
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="bg-white min-h-screen">
      <MarketplaceHeader />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
