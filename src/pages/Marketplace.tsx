import React from 'react';
import { ProductCategory } from '@/components/marketplace/ProductCategory';
import { Header } from '@/components/Header/Header';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';
import { SupplierCategory } from '@/components/marketplace/SupplierCategory';
import { getAllSuppliers } from '@/utils/supplierData';
import { toast } from 'sonner';

// Bike products
const eBikes = [
  {
    id: 'ebike-1',
    name: 'Mens Smart eBike',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//2.jpg',
    price: 1160,
    manufacturer: 'Vulz',
    customDesignUrl: 'https://design.spinlio.com/'
  },
  {
    id: 'ebike-2',
    name: 'Sensations eGravel Bike',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//7.jpg',
    price: 1347,
    manufacturer: 'Vulz',
    customDesignUrl: 'https://design.spinlio.com/vulz/stepthru'
  },
  {
    id: 'ebike-3',
    name: 'Urban Beauty',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//8.jpg',
    price: 980,
    manufacturer: 'Vulz',
    customDesignUrl: 'https://design.spinlio.com/vulz/urban'
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
    manufacturer: 'Vulz',
    customDesignUrl: 'https://design.spinlio.com/'
  },
  {
    id: 'ebike-6',
    name: 'Urban Cloud Chaser',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//3.jpg',
    price: 815,
    manufacturer: 'Vulz'
  },
  {
    id: 'ebike-7',
    name: 'eGravel bike',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//vulz_supreme.jpg',
    price: 1499,
    manufacturer: 'Vulz',
    customDesignUrl: 'https://design.spinlio.com/vulz'
  }
];

// Drivetrain components with updated images
const drivetrainComponents = [
  {
    id: 'dt-1',
    name: 'Shimano 105 Front Calliper',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/105%20front%20calliper.jpeg',
    price: 55,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-2',
    name: 'Shimano 105 Rear Hub',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/105%20hub.jpeg',
    price: 89,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-3',
    name: 'Shimano XTR Cassette',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/cassette.jpeg',
    price: 112,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-4',
    name: 'Shimano CUES Road Bike Lever',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/CUES%20lever.jpeg',
    price: 78,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-5',
    name: 'Shimano Dura-Ace Calliper',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/Dura-ace%20calliper.jpeg',
    price: 195,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-6',
    name: 'Shimano GRX Pedals',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/GRX%20Pedals.jpeg',
    price: 95,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-7',
    name: 'Shimano XTR Derailleur',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/xrt%20di2%20deralier.jpeg',
    price: 210,
    manufacturer: 'Shimano'
  },
  {
    id: 'dt-8',
    name: 'Shimano XTR Lever',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/xtra%20lever.jpeg',
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
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/sim%20disp.jpeg',
    price: 182,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-2',
    name: 'Shimano Steps 504Wh Battery',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/504wh.jpeg',
    price: 435,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-3',
    name: 'Shimano 630Wh Battery',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/630wh.jpeg',
    price: 520,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-4',
    name: 'Shimano Di2 Switch',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/Di2%20Switch.jpeg',
    price: 85,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-5',
    name: 'Shimano STEPS Switch',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/disp.jpeg',
    price: 95,
    manufacturer: 'Shimano'
  },
  {
    id: 'ebc-6',
    name: 'Shimano EP8 Motor',
    image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/EP8.jpeg',
    price: 610,
    manufacturer: 'Shimano',
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models/1742796907092_Shimano_Ep800.stl',
    modelType: 'STL'
  }
];

// The key fix: Properly declare the component as React.FC
const Marketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredEBikes, setFilteredEBikes] = React.useState(eBikes);
  const [filteredDrivetrainComponents, setFilteredDrivetrainComponents] = React.useState(drivetrainComponents);
  const [filteredRoadBikes, setFilteredRoadBikes] = React.useState(roadBikes);
  const [filteredEBikeComponents, setFilteredEBikeComponents] = React.useState(eBikeComponents);
  const [filteredSuppliers, setFilteredSuppliers] = React.useState(getAllSuppliers());
  const [activeCategory, setActiveCategory] = React.useState('all');
  
  // Filter products when search query changes
  React.useEffect(() => {
    filterProducts(searchQuery, activeCategory);
  }, [searchQuery, activeCategory]);
  
  // Handle search from the search button
  const handleSearch = (query: string, category: string) => {
    setSearchQuery(query);
    setActiveCategory(category);
    filterProducts(query, category);
    
    if (query.trim()) {
      toast.success(`Searching for "${query}" in ${category === 'all' ? 'all categories' : category}`);
    }
  };
  
  // Filter products based on search query and category
  const filterProducts = (query: string, category: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // If no query, show all products
    if (!normalizedQuery) {
      setFilteredEBikes(eBikes);
      setFilteredDrivetrainComponents(drivetrainComponents);
      setFilteredRoadBikes(roadBikes);
      setFilteredEBikeComponents(eBikeComponents);
      setFilteredSuppliers(getAllSuppliers());
      return;
    }
    
    // Filter suppliers
    const suppliers = getAllSuppliers().filter(supplier => 
      supplier.name.toLowerCase().includes(normalizedQuery) || 
      supplier.shortDescription.toLowerCase().includes(normalizedQuery)
    );
    setFilteredSuppliers(suppliers);
    
    // Filter eBikes
    const filteredEBs = eBikes.filter(bike => 
      bike.name.toLowerCase().includes(normalizedQuery) || 
      bike.manufacturer.toLowerCase().includes(normalizedQuery)
    );
    setFilteredEBikes(filteredEBs);
    
    // Filter drivetrain components
    const filteredDTs = drivetrainComponents.filter(component => 
      component.name.toLowerCase().includes(normalizedQuery) || 
      component.manufacturer.toLowerCase().includes(normalizedQuery)
    );
    setFilteredDrivetrainComponents(filteredDTs);
    
    // Filter road bikes
    const filteredRBs = roadBikes.filter(bike => 
      bike.name.toLowerCase().includes(normalizedQuery) || 
      bike.manufacturer.toLowerCase().includes(normalizedQuery)
    );
    setFilteredRoadBikes(filteredRBs);
    
    // Filter eBike components
    const filteredEBCs = eBikeComponents.filter(component => 
      component.name.toLowerCase().includes(normalizedQuery) || 
      component.manufacturer.toLowerCase().includes(normalizedQuery)
    );
    setFilteredEBikeComponents(filteredEBCs);
  };
  
  // Get filtered products based on active category
  const getVisibleProducts = () => {
    switch (activeCategory) {
      case 'suppliers':
        return { suppliers: filteredSuppliers, showOthers: false };
      case 'ebikes':
        return { ebikes: filteredEBikes, showOthers: false };
      case 'roadbikes':
        return { roadbikes: filteredRoadBikes, showOthers: false };
      case 'drivetrain':
        return { drivetrain: filteredDrivetrainComponents, showOthers: false };
      case 'ebikecomp':
        return { ebikecomp: filteredEBikeComponents, showOthers: false };
      default:
        return { 
          suppliers: filteredSuppliers, 
          ebikes: filteredEBikes, 
          roadbikes: filteredRoadBikes, 
          drivetrain: filteredDrivetrainComponents, 
          ebikecomp: filteredEBikeComponents,
          showOthers: true
        };
    }
  };
  
  const visibleProducts = getVisibleProducts();
  
  return (
    <div className="bg-white h-screen w-full overflow-y-auto">
      <Header />
      
      <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-20">
        <MarketplaceSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
        
        <div className="mt-8 space-y-12">
          {/* Show suppliers if in 'all' or 'suppliers' category */}
          {(visibleProducts.showOthers || activeCategory === 'suppliers') && visibleProducts.suppliers && visibleProducts.suppliers.length > 0 && (
            <SupplierCategory 
              title="Suppliers" 
              suppliers={visibleProducts.suppliers.map(s => ({
                id: s.id,
                name: s.name,
                logoUrl: s.logoUrl,
                shortDescription: s.shortDescription
              }))} 
            />
          )}
          
          {/* Show eBikes if in 'all' or 'ebikes' category */}
          {(visibleProducts.showOthers || activeCategory === 'ebikes') && visibleProducts.ebikes && visibleProducts.ebikes.length > 0 && (
            <ProductCategory 
              title="eBikes" 
              products={visibleProducts.ebikes} 
            />
          )}
          
          {/* Show drivetrain components if in 'all' or 'drivetrain' category */}
          {(visibleProducts.showOthers || activeCategory === 'drivetrain') && visibleProducts.drivetrain && visibleProducts.drivetrain.length > 0 && (
            <ProductCategory 
              title="Drivetrain Components" 
              products={visibleProducts.drivetrain} 
            />
          )}
          
          {/* Show road bikes if in 'all' or 'roadbikes' category */}
          {(visibleProducts.showOthers || activeCategory === 'roadbikes') && visibleProducts.roadbikes && visibleProducts.roadbikes.length > 0 && (
            <ProductCategory 
              title="Road Bikes" 
              products={visibleProducts.roadbikes} 
            />
          )}
          
          {/* Show eBike components if in 'all' or 'ebikecomp' category */}
          {(visibleProducts.showOthers || activeCategory === 'ebikecomp') && visibleProducts.ebikecomp && visibleProducts.ebikecomp.length > 0 && (
            <ProductCategory 
              title="eBike Components" 
              products={visibleProducts.ebikecomp} 
            />
          )}
          
          {/* Show message when no products found */}
          {searchQuery && !Object.values(visibleProducts).some(value => 
            Array.isArray(value) && value.length > 0
          ) && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-xl font-semibold text-gray-800">No products found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
