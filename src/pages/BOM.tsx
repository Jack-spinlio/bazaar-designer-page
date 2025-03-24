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
import { Viewport } from '@/components/Viewport';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  FrameIcon, 
  Battery, 
  Cog, 
  Gamepad, 
  Disc, 
  Utensils, 
  Puzzle, 
  Grip 
} from 'lucide-react';

interface ComponentData {
  id: string;
  image: string;
  component: string;
  manufacturer: string;
  model: string;
  productionTime: string;
  country: string;
  price: string;
  icon: React.ReactNode;
}

const BOM = () => {
  const isMobile = useIsMobile();
  
  const components: ComponentData[] = [
    {
      id: "1",
      image: "/lovable-uploads/42f9f00c-fd1c-4b97-807d-f44175f2b2ed.png#frame",
      component: "Frame",
      manufacturer: "ModMo",
      model: "Saigon S2",
      productionTime: "90 days",
      country: "Vietnam",
      price: "$97",
      icon: <FrameIcon size={16} />
    },
    {
      id: "2",
      image: "/lovable-uploads/42f9f00c-fd1c-4b97-807d-f44175f2b2ed.png#motor",
      component: "Motor",
      manufacturer: "Bafang",
      model: "G310",
      productionTime: "42 days",
      country: "China",
      price: "$52",
      icon: <Cog size={16} />
    },
    {
      id: "3",
      image: "/lovable-uploads/42f9f00c-fd1c-4b97-807d-f44175f2b2ed.png#handlebar",
      component: "Handlebar",
      manufacturer: "King Meter",
      model: "SW-LCD",
      productionTime: "35 days",
      country: "Taiwan",
      price: "$41",
      icon: <Gamepad size={16} />
    },
    {
      id: "4",
      image: "/lovable-uploads/42f9f00c-fd1c-4b97-807d-f44175f2b2ed.png#brakes",
      component: "Brakes",
      manufacturer: "Tektro",
      model: "HD-E500",
      productionTime: "40 days",
      country: "Taiwan",
      price: "$36",
      icon: <Disc size={16} />
    },
    {
      id: "5",
      image: "/lovable-uploads/42f9f00c-fd1c-4b97-807d-f44175f2b2ed.png#hub",
      component: "Hub",
      manufacturer: "Enviolo",
      model: "TR CVP",
      productionTime: "60 days",
      country: "Netherlands",
      price: "$141",
      icon: <Disc size={16} />
    },
    {
      id: "6",
      image: "/lovable-uploads/42f9f00c-fd1c-4b97-807d-f44175f2b2ed.png#battery",
      component: "Battery",
      manufacturer: "Sansung",
      model: "36V 14Ah",
      productionTime: "60 days",
      country: "South Korea",
      price: "$221",
      icon: <Battery size={16} />
    },
    {
      id: "7",
      image: "/lovable-uploads/42f9f00c-fd1c-4b97-807d-f44175f2b2ed.png#tires",
      component: "Tires",
      manufacturer: "Schwalbe",
      model: "Marathon",
      productionTime: "12 days",
      country: "Vietnam",
      price: "$6",
      icon: <Disc size={16} />
    },
    {
      id: "8",
      image: "/lovable-uploads/42f9f00c-fd1c-4b97-807d-f44175f2b2ed.png#fork",
      component: "Fork",
      manufacturer: "Suntour",
      model: "NCX E25",
      productionTime: "40 days",
      country: "China",
      price: "$37",
      icon: <Utensils size={16} />
    },
    {
      id: "9",
      image: "/lovable-uploads/42f9f00c-fd1c-4b97-807d-f44175f2b2ed.png#saddle",
      component: "Saddle",
      manufacturer: "Selle Royal",
      model: "Respiro",
      productionTime: "30 days",
      country: "Vietnam",
      price: "$3",
      icon: <Puzzle size={16} />
    },
    {
      id: "10",
      image: "/lovable-uploads/42f9f00c-fd1c-4b97-807d-f44175f2b2ed.png#grips",
      component: "Grips",
      manufacturer: "Ergon",
      model: "GP1",
      productionTime: "10 days",
      country: "China",
      price: "$1.3",
      icon: <Grip size={16} />
    }
  ];

  const handleComponentPlaced = () => {
    console.log('Component placed in the viewport');
  };

  return (
    <Layout>
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} h-full w-full`}>
        <div className={`${isMobile ? 'w-full h-1/2' : 'w-3/5 xl:w-2/3'} overflow-auto`}>
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-semibold">Bill of materials</h2>
              <button className="text-gray-500 hover:text-gray-700">
                See all
              </button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead className={isMobile ? "hidden sm:table-cell" : ""}>Manufacturer</TableHead>
                    <TableHead className={isMobile ? "hidden sm:table-cell" : ""}>Model</TableHead>
                    <TableHead className={`${isMobile ? "hidden md:table-cell" : ""} whitespace-nowrap`}>Production Time</TableHead>
                    <TableHead className={isMobile ? "hidden lg:table-cell" : ""}>Country</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {components.map((component) => (
                    <TableRow key={component.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="w-[40px]">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                            {component.icon}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{component.component}</TableCell>
                      <TableCell className={isMobile ? "hidden sm:table-cell" : ""}>{component.manufacturer}</TableCell>
                      <TableCell className={isMobile ? "hidden sm:table-cell" : ""}>{component.model}</TableCell>
                      <TableCell className={isMobile ? "hidden md:table-cell" : ""}>{component.productionTime}</TableCell>
                      <TableCell className={isMobile ? "hidden lg:table-cell" : ""}>{component.country}</TableCell>
                      <TableCell>{component.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        <div className={`${isMobile ? 'w-full h-1/2' : 'w-2/5 xl:w-1/3'} h-full pl-0 md:pl-2.5`}>
          <Viewport 
            selectedComponent={null}
            onComponentPlaced={() => console.log('Component placed in the viewport')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default BOM;
