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
  Pencil, 
  Puzzle, 
  FileSpreadsheet, 
  Bookmark,
  Lightbulb,
  Shield,
  Link,
  Footprints
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
    image: "https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//frame_image.png",
    component: "Frame",
    manufacturer: "ModMo",
    model: "Saigon S2",
    productionTime: "90 days",
    country: "Vietnam",
    price: "$97",
    icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//frame_image.png" alt="Frame" className="w-6 h-6 object-cover" />
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
    icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//hub.png" alt="Motor" className="w-6 h-6 object-cover" />
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
    icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//handlebar.png" alt="Handlebar" className="w-6 h-6 object-cover" />
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
    icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//brakes.png" alt="Brakes" className="w-6 h-6 object-cover" />
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
    icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//rear_hub.png" alt="Hub" className="w-6 h-6 object-cover" />
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
    icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//battery.png" alt="Battery" className="w-6 h-6 object-cover" />
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
    icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//tyre.png" alt="Tires" className="w-6 h-6 object-cover" />
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
    icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//fork.png" alt="Fork" className="w-6 h-6 object-cover" />
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
    icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//saddle.png" alt="Saddle" className="w-6 h-6 object-cover" />
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
    icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//grips.png" alt="Grips" className="w-6 h-6 object-cover" />
  },
];

const bikeComponents = [
  { id: '1', name: 'Frame', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//frame_image.png" alt="Frame" className="w-[24px] h-[24px] object-cover" />, days: 90, color: 'bg-blue-100', startWeek: 1 },
  { id: '2', name: 'Fork', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//fork.png" alt="Fork" className="w-[24px] h-[24px] object-cover" />, days: 42, color: 'bg-purple-100', startWeek: 8 },
  { id: '3', name: 'Motor', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//hub.png" alt="Motor" className="w-[24px] h-[24px] object-cover" />, days: 35, color: 'bg-green-100', startWeek: 11 },
  { id: '4', name: 'Rear Hub', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//rear_hub.png" alt="Rear Hub" className="w-[24px] h-[24px] object-cover" />, days: 40, color: 'bg-pink-100', startWeek: 9 },
  { id: '5', name: 'Handlebar', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//handlebar.png" alt="Handlebar" className="w-[24px] h-[24px] object-cover" />, days: 60, color: 'bg-cyan-100', startWeek: 8 },
  { id: '6', name: 'Brakes', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//brakes.png" alt="Brakes" className="w-[24px] h-[24px] object-cover" />, days: 60, color: 'bg-yellow-100', startWeek: 8 },
  { id: '7', name: 'Battery', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//battery.png" alt="Battery" className="w-[24px] h-[24px] object-cover" />, days: 12, color: 'bg-red-100', startWeek: 11 },
  { id: '8', name: 'Tires', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//tyre.png" alt="Tires" className="w-[24px] h-[24px] object-cover" />, days: 31, color: 'bg-green-100', startWeek: 10 },
  { id: '9', name: 'Grips', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//grips.png" alt="Grips" className="w-[24px] h-[24px] object-cover" />, days: 30, color: 'bg-blue-100', startWeek: 10 },
  { id: '10', name: 'Lights', icon: <Lightbulb size={18} />, days: 10, color: 'bg-orange-100', startWeek: 11 },
  { id: '11', name: 'Fenders', icon: <Shield size={18} />, days: 30, color: 'bg-pink-100', startWeek: 10 },
  { id: '12', name: 'Belt Drive', icon: <Link size={18} />, days: 30, color: 'bg-teal-200', startWeek: 10 },
  { id: '13', name: 'Kickstand', icon: <Footprints size={18} />, days: 40, color: 'bg-amber-400', startWeek: 9 },
  { id: '14', name: 'Pedals', icon: <Footprints size={18} />, days: 45, color: 'bg-red-400', startWeek: 9 },
  { id: '15', name: 'Crankset', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//hub.png" alt="Crankset" className="w-[24px] h-[24px] object-cover" />, days: 60, color: 'bg-violet-400', startWeek: 8 },
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
                  <TableHead className="whitespace-nowrap">Production Time</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {components.map((component) => (
                  <TableRow key={component.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="w-[40px]">
                      <div className="flex items-center">
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
