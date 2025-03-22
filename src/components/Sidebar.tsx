
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentCard } from './ComponentCard';
import { 
  Search, 
  Bike
} from 'lucide-react';
import { toast } from 'sonner';

// Bike components for the library
const BIKE_COMPONENTS = [
  { id: 'bike-1', name: 'Road bike', type: 'BIKE', thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png', folder: 'Bikes', shape: 'box' as const },
  { id: 'bike-2', name: 'Canyon bike', type: 'BIKE', thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png', folder: 'Bikes', shape: 'box' as const },
  { id: 'bike-3', name: 'Girls bike', type: 'BIKE', thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png', folder: 'Bikes', shape: 'box' as const },
  { id: 'bike-4', name: 'City bike', type: 'BIKE', thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png', folder: 'Bikes', shape: 'box' as const },
  { id: 'bike-5', name: 'Electric bike', type: 'BIKE', thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png', folder: 'Bikes', shape: 'box' as const },
  { id: 'bike-6', name: 'Classic bike', type: 'BIKE', thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png', folder: 'Bikes', shape: 'box' as const },
  { id: 'bike-7', name: 'e-Cargo', type: 'BIKE', thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png', folder: 'Bikes', shape: 'box' as const },
  { id: 'bike-8', name: 'e-MTB', type: 'BIKE', thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png', folder: 'Bikes', shape: 'box' as const },
  { id: 'bike-9', name: 'City bike', type: 'BIKE', thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png', folder: 'Bikes', shape: 'box' as const },
  { id: 'bike-10', name: 'Race bike', type: 'BIKE', thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png', folder: 'Bikes', shape: 'box' as const },
];

// Basic shapes for the component library
const BASIC_SHAPES = [
  { id: 'shape-1', name: 'Box', type: 'SHAPE', thumbnail: '/placeholder.svg', folder: 'Basic Shapes', shape: 'box' as const },
  { id: 'shape-2', name: 'Sphere', type: 'SHAPE', thumbnail: '/placeholder.svg', folder: 'Basic Shapes', shape: 'sphere' as const },
  { id: 'shape-3', name: 'Cylinder', type: 'SHAPE', thumbnail: '/placeholder.svg', folder: 'Basic Shapes', shape: 'cylinder' as const },
  { id: 'shape-4', name: 'Cone', type: 'SHAPE', thumbnail: '/placeholder.svg', folder: 'Basic Shapes', shape: 'cone' as const },
  { id: 'shape-5', name: 'Torus', type: 'SHAPE', thumbnail: '/placeholder.svg', folder: 'Basic Shapes', shape: 'torus' as const },
];

// Mock data for the component library
export const MOCK_COMPONENTS = [
  { id: '1', name: 'Bike Handlebar', type: 'STL', thumbnail: '/placeholder.svg', folder: 'Bike Parts', shape: 'cylinder' as const },
  { id: '2', name: 'Brake Lever', type: 'OBJ', thumbnail: '/placeholder.svg', folder: 'Bike Parts', shape: 'box' as const },
  { id: '3', name: 'Grip', type: 'STEP', thumbnail: '/placeholder.svg', folder: 'Bike Parts', shape: 'sphere' as const },
  { id: '4', name: 'Stem', type: 'STL', thumbnail: '/placeholder.svg', folder: 'Bike Parts', shape: 'cone' as const },
  { id: '5', name: 'Seat Post', type: 'OBJ', thumbnail: '/placeholder.svg', folder: 'Bike Parts', shape: 'torus' as const },
];

export interface ComponentItem {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  folder?: string;
  shape: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus';
}

interface SidebarProps {
  onSelectComponent?: (component: ComponentItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectComponent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [components, setComponents] = useState<ComponentItem[]>([...BIKE_COMPONENTS, ...MOCK_COMPONENTS, ...BASIC_SHAPES]);
  
  const filteredComponents = components.filter(
    component => component.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComponentSelect = (component: ComponentItem) => {
    console.log('Component selected in Sidebar:', component.name);
    if (onSelectComponent) {
      onSelectComponent(component);
      toast.success(`Selected component: ${component.name}`);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Bike size={20} className="text-gray-800" />
            <h2 className="text-lg font-medium">Prefabs</h2>
          </div>
          <Button variant="link" className="text-gray-600">
            See all
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-9 bg-gray-50 border-gray-200 rounded-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {BIKE_COMPONENTS.slice(0, 10).map((component) => (
            <div 
              key={component.id}
              onClick={() => handleComponentSelect(component)}
              className="bg-gray-50 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors flex flex-col items-center"
            >
              <div className="w-full h-24 mb-2 flex items-center justify-center">
                <img 
                  src={component.thumbnail} 
                  alt={component.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="text-sm text-center font-medium text-gray-800">{component.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
