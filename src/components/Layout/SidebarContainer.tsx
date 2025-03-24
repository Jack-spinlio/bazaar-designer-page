import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar, ComponentItem } from '@/components/Sidebar';
import { PrefabSidebar, PrefabItem } from '@/components/PrefabSidebar';
import { SavedSidebar, SavedDesign } from '@/components/SavedSidebar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TimelineChart } from '@/components/TimelineChart';
import EditToolbar from '@/components/EditToolbar';
import { 
  ChevronRight, 
  Pencil, 
  Puzzle, 
  FileSpreadsheet, 
  Bookmark,
  FrameIcon,
  Battery,
  Disc,
  Grip,
  Gamepad,
  Cog,
  Utensils
} from 'lucide-react';

interface SidebarContainerProps {
  activeTab: string | null;
  onComponentSelected: (component: ComponentItem) => void;
  onPrefabSelected: (prefab: PrefabItem) => void;
  onDesignSelected: (design: SavedDesign) => void;
}

const components = [
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
  },
];

const bikeComponents = [
  { id: '1', name: 'Frame', icon: <Pencil size={18} />, days: 90, color: 'bg-blue-100', startWeek: 1 },
  { id: '2', name: 'Fork', icon: <Puzzle size={18} />, days: 42, color: 'bg-purple-100', startWeek: 8 },
  { id: '3', name: 'Motor', icon: <Pencil size={18} />, days: 35, color: 'bg-green-100', startWeek: 9 },
  { id: '4', name: 'Rear Hub', icon: <FileSpreadsheet size={18} />, days: 40, color: 'bg-pink-100', startWeek: 9 },
  { id: '5', name: 'Handlebar', icon: <Bookmark size={18} />, days: 60, color: 'bg-cyan-100', startWeek: 8 },
];

export const SidebarContainer: React.FC<SidebarContainerProps> = ({
  activeTab,
  onComponentSelected,
  onPrefabSelected,
  onDesignSelected
}) => {
  const getSidebarWidth = () => {
    switch (activeTab) {
      case "edit":
      case "components":
      case "prefabs":
      case "saved":
        return "w-[400px]";
      case "bom":
        return "w-[750px]";
      case "timeline":
        return "w-[800px]";
      default:
        return "w-0";
    }
  };

  const renderSidebarContent = () => {
    switch (activeTab) {
      case "edit":
        return (
          <div className="h-full bg-white p-4 overflow-auto rounded-2xl shadow-sm">
            <EditToolbar />
          </div>
        );
      case "components":
        return (
          <div className="h-full bg-white overflow-auto rounded-2xl shadow-sm">
            <Sidebar onSelectComponent={onComponentSelected} />
          </div>
        );
      case "prefabs":
        return (
          <div className="h-full bg-white overflow-auto rounded-2xl shadow-sm">
            <PrefabSidebar onSelectPrefab={onPrefabSelected} />
          </div>
        );
      case "saved":
        return (
          <div className="h-full bg-white overflow-auto rounded-2xl shadow-sm">
            <SavedSidebar onSelectDesign={onDesignSelected} />
          </div>
        );
      case "bom":
        return (
          <div className="h-full bg-white p-4 overflow-auto rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Bill of Materials</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
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
                      <div className="flex items-center">
                        <ChevronRight size={18} className="mr-2 text-gray-400" />
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                          <div className="absolute w-6 h-6 flex items-center justify-center">
                            {component.icon}
                          </div>
                          <img 
                            src={component.image} 
                            alt={component.component} 
                            className="w-7 h-7 object-contain opacity-40"
                          />
                        </div>
                      </div>
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
        );
      case "timeline":
        return (
          <div className="h-full bg-white p-4 overflow-auto rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Production Timeline</h2>
            <TimelineChart components={bikeComponents} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {activeTab && (
        <div className={`transition-all duration-300 ease-in-out ml-2.5 h-full ${getSidebarWidth()}`}>
          {renderSidebarContent()}
        </div>
      )}
    </>
  );
};
