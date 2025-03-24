
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Viewport } from '@/components/Viewport';
import { IconSidebar } from '@/components/IconSidebar';
import EditToolbar from '@/components/EditToolbar';
import { Sidebar, ComponentItem } from '@/components/Sidebar';
import { PrefabSidebar, PrefabItem } from '@/components/PrefabSidebar';
import { SavedSidebar, SavedDesign } from '@/components/SavedSidebar';
import { BikeComponent } from '@/pages/Timeline';
import { TimelineChart } from '@/components/TimelineChart';
import { FileUploader } from '@/components/FileUploader';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// BOM data
const components = [
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
];

// Timeline data
const bikeComponents: BikeComponent[] = [
  { id: '1', name: 'Frame', icon: <Pencil size={18} />, days: 90, color: 'bg-blue-100', startWeek: 1 },
  { id: '2', name: 'Fork', icon: <Puzzle size={18} />, days: 42, color: 'bg-purple-100', startWeek: 8 },
  { id: '3', name: 'Motor', icon: <Pencil size={18} />, days: 35, color: 'bg-green-100', startWeek: 9 },
  { id: '4', name: 'Rear Hub', icon: <FileSpreadsheet size={18} />, days: 40, color: 'bg-pink-100', startWeek: 9 },
  { id: '5', name: 'Handlebar', icon: <Bookmark size={18} />, days: 60, color: 'bg-cyan-100', startWeek: 8 },
];

import { Pencil, Puzzle, FileSpreadsheet, Bookmark } from "lucide-react";

const DesignStudio = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  // States for different components
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [selectedPrefab, setSelectedPrefab] = useState<PrefabItem | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Handlers for component selection
  const handleComponentSelected = (component: ComponentItem) => {
    setSelectedComponent(component);
    console.log('Component selected:', component.name);
  };

  const handlePrefabSelected = (prefab: PrefabItem) => {
    setSelectedPrefab(prefab);
    console.log('Prefab selected:', prefab.name);
  };

  const handleDesignSelected = (design: SavedDesign) => {
    setSelectedDesign(design);
    console.log('Design selected:', design.name);
  };

  const handleComponentPlaced = () => {
    console.log('Component placed in scene');
    setSelectedComponent(null);
    setSelectedPrefab(null);
  };

  // Sidebar content based on active tab
  const renderSidebar = () => {
    switch (activeTab) {
      case "edit":
        return <EditToolbar />;
      case "prefabs":
        return <PrefabSidebar onSelectPrefab={handlePrefabSelected} />;
      case "components":
        return <Sidebar onSelectComponent={handleComponentSelected} />;
      case "saved":
        return <SavedSidebar onSelectDesign={handleDesignSelected} />;
      case "bom":
        return (
          <div className="h-full bg-white p-4 overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Bill of Materials</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {components.map((component) => (
                  <TableRow key={component.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="w-[40px]">
                      <span role="img" aria-label={component.component}>
                        {component.icon}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{component.component}</TableCell>
                    <TableCell>{component.manufacturer}</TableCell>
                    <TableCell>{component.model}</TableCell>
                    <TableCell>{component.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      case "timeline":
        return (
          <div className="h-full bg-white p-4 overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Production Timeline</h2>
            <TimelineChart components={bikeComponents} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5] p-2.5">
      <div className="flex h-full ml-0">
        <IconSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      <div className="flex flex-1 overflow-hidden mt-2.5 ml-2.5">
        {/* Sidebar based on active tab */}
        {activeTab && (
          <div className="w-[320px] h-full mr-2.5">
            {renderSidebar()}
          </div>
        )}

        {/* Persistent viewport */}
        <div className={`${activeTab ? 'flex-1' : 'w-full'} h-full`}>
          <Viewport 
            selectedComponent={selectedComponent}
            onComponentPlaced={handleComponentPlaced}
          />
        </div>
      </div>

      {/* Upload dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <FileUploader 
            onClose={() => setUploadDialogOpen(false)} 
            onFileUploaded={() => {
              setUploadDialogOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DesignStudio;
