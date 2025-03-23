
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

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Components</h2>
            <div className="flex space-x-2">
              <div className="relative inline-block">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border rounded-full text-sm w-64"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium">Details</button>
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">Browse</button>
              </div>
            </div>
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
    </Layout>
  );
};

export default BOM;
