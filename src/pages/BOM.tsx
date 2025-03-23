
import React from 'react';
import { Layout } from '@/components/Layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronRight } from 'lucide-react';
import { Viewport } from '@/components/Viewport';

// Type for component data
interface ComponentData {
  id: string;
  icon: string;
  component: string;
  manufacturer: string;
  model: string;
  productionTime: string;
  country: string;
  price: string;
}

const BOM = () => {
  // Sample data for the BOM table - in a real app this would come from your state management
  const components: ComponentData[] = [
    {
      id: "1",
      icon: "🚲",
      component: "Frame",
      manufacturer: "ModMo",
      model: "Saigon S2",
      productionTime: "90 days",
      country: "Vietnam",
      price: "$97"
    },
    {
      id: "2",
      icon: "⚙️",
      component: "Motor",
      manufacturer: "Bafang",
      model: "G310",
      productionTime: "42 days",
      country: "China",
      price: "$52"
    },
    {
      id: "3",
      icon: "🛞",
      component: "Handlebar",
      manufacturer: "King Meter",
      model: "SW-LCD",
      productionTime: "35 days",
      country: "Taiwan",
      price: "$41"
    },
    {
      id: "4",
      icon: "🛑",
      component: "Brakes",
      manufacturer: "Tektro",
      model: "HD-E500",
      productionTime: "40 days",
      country: "Taiwan",
      price: "$36"
    },
    {
      id: "5",
      icon: "🔄",
      component: "Hub",
      manufacturer: "Enviolo",
      model: "TR CVP",
      productionTime: "60 days",
      country: "Netherlands",
      price: "$141"
    },
    {
      id: "6",
      icon: "🔋",
      component: "Battery",
      manufacturer: "Sansung",
      model: "36V 14Ah",
      productionTime: "60 days",
      country: "South Korea",
      price: "$221"
    },
    {
      id: "7",
      icon: "⚫",
      component: "Tires",
      manufacturer: "Schwalbe",
      model: "Marathon",
      productionTime: "12 days",
      country: "Vietnam",
      price: "$6"
    },
    {
      id: "8",
      icon: "🍴",
      component: "Fork",
      manufacturer: "Suntour",
      model: "NCX E25",
      productionTime: "40 days",
      country: "China",
      price: "$37"
    },
    {
      id: "9",
      icon: "🪑",
      component: "Saddle",
      manufacturer: "Selle Royal",
      model: "Respiro",
      productionTime: "30 days",
      country: "Vietnam",
      price: "$3"
    },
    {
      id: "10",
      icon: "🔧",
      component: "Grips",
      manufacturer: "Ergon",
      model: "GP1",
      productionTime: "10 days",
      country: "China",
      price: "$1.3"
    }
  ];

  const handleComponentPlaced = () => {
    console.log('Component placed in the viewport');
  };

  return (
    <Layout>
      <div className="flex h-full">
        {/* Left side: Bill of Materials table */}
        <div className="w-3/5 overflow-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Bill of materials</h2>
              <button className="text-gray-500 hover:text-gray-700">
                See all
              </button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Production time</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {components.map((component) => (
                    <TableRow key={component.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="w-[40px]">
                        <ChevronRight size={16} className="text-gray-400" />
                      </TableCell>
                      <TableCell className="w-[40px]">
                        <span role="img" aria-label={component.component}>
                          {component.icon}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{component.component}</TableCell>
                      <TableCell>{component.manufacturer}</TableCell>
                      <TableCell>{component.model}</TableCell>
                      <TableCell>{component.productionTime}</TableCell>
                      <TableCell>{component.country}</TableCell>
                      <TableCell>{component.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        {/* Right side: 3D Viewport */}
        <div className="w-2/5 h-full pl-2.5">
          <Viewport 
            selectedComponent={null}
            onComponentPlaced={handleComponentPlaced}
          />
        </div>
      </div>
    </Layout>
  );
};

export default BOM;
