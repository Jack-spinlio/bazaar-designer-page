import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Viewport } from '@/components/Viewport';
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

// Import icons for tabs
import { 
  Pencil, 
  Bike, 
  Puzzle, 
  Bookmark, 
  Clock, 
  Upload,
  FileSpreadsheet
} from "lucide-react";

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
  { id: '1', name: 'Frame', icon: <Bike size={18} />, days: 90, color: 'bg-blue-100', startWeek: 1 },
  { id: '2', name: 'Fork', icon: <Puzzle size={18} />, days: 42, color: 'bg-purple-100', startWeek: 8 },
  { id: '3', name: 'Motor', icon: <Pencil size={18} />, days: 35, color: 'bg-green-100', startWeek: 9 },
  { id: '4', name: 'Rear Hub', icon: <FileSpreadsheet size={18} />, days: 40, color: 'bg-pink-100', startWeek: 9 },
  { id: '5', name: 'Handlebar', icon: <Bookmark size={18} />, days: 60, color: 'bg-cyan-100', startWeek: 8 },
];

const DesignStudio = () => {
  // States for different components
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [selectedPrefab, setSelectedPrefab] = useState<PrefabItem | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

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

  // Tab handling with toggle behavior
  const handleTabClick = (tabId: string) => {
    if (activeTab === tabId) {
      setActiveTab(null);
    } else {
      setActiveTab(tabId);
    }
  };

  // Tab definitions with icons
  const tabs = [
    { id: "edit", label: "Edit", icon: Pencil },
    { id: "prefabs", label: "Prefabs", icon: Bike },
    { id: "components", label: "Components", icon: Puzzle },
    { id: "bom", label: "BOM", icon: FileSpreadsheet },
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "uploads", label: "Upload", icon: Upload },
  ];

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
      case "uploads":
        return (
          <div className="h-full bg-white p-4 flex flex-col items-center justify-center">
            <button
              onClick={() => setUploadDialogOpen(true)}
              className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2"
            >
              <Upload size={16} />
              Upload Component
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="flex h-full">
        {/* Tabbed navigation */}
        <div className="flex flex-col h-full">
          <div className="p-2 bg-white rounded-2xl shadow-sm mb-2.5">
            <div className="flex flex-col space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <tab.icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar based on active tab - only render if a tab is active */}
        {activeTab && (
          <div className="w-[320px] h-full ml-2.5">
            {renderSidebar()}
          </div>
        )}

        {/* Persistent viewport - adjust width based on whether sidebar is open */}
        <div className={`${activeTab ? 'flex-1' : 'w-full'} h-full ${activeTab ? 'ml-2.5' : ''}`}>
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
    </Layout>
  );
};

export default DesignStudio;
