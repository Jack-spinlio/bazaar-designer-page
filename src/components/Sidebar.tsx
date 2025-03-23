import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ComponentCard } from './ComponentCard';
import { Search, Bike } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BIKE_COMPONENTS = [{
  id: 'bike-1',
  name: 'Road bike',
  type: 'BIKE',
  thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png',
  folder: 'Bikes',
  shape: 'box' as const
}, {
  id: 'bike-2',
  name: 'Canyon bike',
  type: 'BIKE',
  thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png',
  folder: 'Bikes',
  shape: 'box' as const
}, {
  id: 'bike-3',
  name: 'Girls bike',
  type: 'BIKE',
  thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png',
  folder: 'Bikes',
  shape: 'box' as const
}, {
  id: 'bike-4',
  name: 'City bike',
  type: 'BIKE',
  thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png',
  folder: 'Bikes',
  shape: 'box' as const
}, {
  id: 'bike-5',
  name: 'Electric bike',
  type: 'BIKE',
  thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png',
  folder: 'Bikes',
  shape: 'box' as const
}, {
  id: 'bike-6',
  name: 'Classic bike',
  type: 'BIKE',
  thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png',
  folder: 'Bikes',
  shape: 'box' as const
}, {
  id: 'bike-7',
  name: 'e-Cargo',
  type: 'BIKE',
  thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png',
  folder: 'Bikes',
  shape: 'box' as const
}, {
  id: 'bike-8',
  name: 'e-MTB',
  type: 'BIKE',
  thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png',
  folder: 'Bikes',
  shape: 'box' as const
}, {
  id: 'bike-9',
  name: 'City bike',
  type: 'BIKE',
  thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png',
  folder: 'Bikes',
  shape: 'box' as const
}, {
  id: 'bike-10',
  name: 'Race bike',
  type: 'BIKE',
  thumbnail: '/lovable-uploads/9191150b-7bc6-46a5-942d-92a375bd4cf6.png',
  folder: 'Bikes',
  shape: 'box' as const
}];

const BASIC_SHAPES = [{
  id: 'shape-1',
  name: 'Box',
  type: 'SHAPE',
  thumbnail: '/placeholder.svg',
  folder: 'Basic Shapes',
  shape: 'box' as const
}, {
  id: 'shape-2',
  name: 'Sphere',
  type: 'SHAPE',
  thumbnail: '/placeholder.svg',
  folder: 'Basic Shapes',
  shape: 'sphere' as const
}, {
  id: 'shape-3',
  name: 'Cylinder',
  type: 'SHAPE',
  thumbnail: '/placeholder.svg',
  folder: 'Basic Shapes',
  shape: 'cylinder' as const
}, {
  id: 'shape-4',
  name: 'Cone',
  type: 'SHAPE',
  thumbnail: '/placeholder.svg',
  folder: 'Basic Shapes',
  shape: 'cone' as const
}, {
  id: 'shape-5',
  name: 'Torus',
  type: 'SHAPE',
  thumbnail: '/placeholder.svg',
  folder: 'Basic Shapes',
  shape: 'torus' as const
}];

export const MOCK_COMPONENTS = [{
  id: '1',
  name: 'Bike Handlebar',
  type: 'STL',
  thumbnail: '/placeholder.svg',
  folder: 'Bike Parts',
  shape: 'cylinder' as const
}, {
  id: '2',
  name: 'Brake Lever',
  type: 'OBJ',
  thumbnail: '/placeholder.svg',
  folder: 'Bike Parts',
  shape: 'box' as const
}, {
  id: '3',
  name: 'Grip',
  type: 'STEP',
  thumbnail: '/placeholder.svg',
  folder: 'Bike Parts',
  shape: 'sphere' as const
}, {
  id: '4',
  name: 'Stem',
  type: 'STL',
  thumbnail: '/placeholder.svg',
  folder: 'Bike Parts',
  shape: 'cone' as const
}, {
  id: '5',
  name: 'Seat Post',
  type: 'OBJ',
  thumbnail: '/placeholder.svg',
  folder: 'Bike Parts',
  shape: 'torus' as const
}];

export interface ComponentItem {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  folder?: string;
  shape: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus';
  modelUrl?: string; // URL to the 3D model file
}

interface SidebarProps {
  onSelectComponent?: (component: ComponentItem) => void;
  children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onSelectComponent,
  children
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [components, setComponents] = useState<ComponentItem[]>([...BIKE_COMPONENTS, ...MOCK_COMPONENTS, ...BASIC_SHAPES]);
  const [uploadedModels, setUploadedModels] = useState<ComponentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'uploads'>('marketplace');

  useEffect(() => {
    const fetchUploadedModels = async () => {
      setIsLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.storage.from('models').list();
        if (error) {
          throw error;
        }
        if (data) {
          const modelComponents = data.map(file => {
            const fileExt = file.name.split('.').pop()?.toUpperCase() || '';
            const name = file.name.split('.')[0].replace(/_/g, ' ').replace(/^\d+_/, '');

            const {
              data: publicUrlData
            } = supabase.storage.from('models').getPublicUrl(file.name);
            return {
              id: `supabase-${file.id}`,
              name: name,
              type: fileExt,
              thumbnail: '/placeholder.svg',
              folder: 'Uploads',
              shape: 'box' as const,
              modelUrl: publicUrlData.publicUrl
            };
          });
          setUploadedModels(modelComponents);
          setComponents(prev => {
            const filteredComponents = prev.filter(comp => !comp.id.startsWith('supabase-') && !comp.id.startsWith('uploaded-'));
            return [...filteredComponents, ...modelComponents];
          });
        }
      } catch (error) {
        console.error('Error fetching uploaded models:', error);
        toast.error('Failed to load uploaded models');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUploadedModels();
  }, []);

  const filteredComponents = components.filter(component => {
    return component.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUploadedModels = uploadedModels.filter(component => {
    return component.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleComponentSelect = (component: ComponentItem) => {
    console.log('Component selected in Sidebar:', component.name);
    if (onSelectComponent) {
      onSelectComponent(component);
      toast.success(`Selected component: ${component.name}`);
    }
  };

  // If children are provided, render them instead of the default content
  if (children) {
    return (
      <div className="h-full flex flex-col bg-white shadow-sm rounded-2xl overflow-hidden">
        <div className="p-4 py-0 px-[16px]">
          <div className="flex items-center justify-between gap-2 mb-4 py-[10px]">
            <div className="flex items-center gap-2">
              <Bike size={20} className="text-gray-800" />
              <h2 className="text-lg font-medium">Component Library</h2>
            </div>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input type="search" placeholder="Search components" className="pl-9 bg-gray-50 border-gray-200 rounded-full text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white shadow-sm rounded-2xl overflow-hidden">
      <div className="p-4 py-0 px-[16px]">
        <div className="flex items-center justify-between gap-2 mb-4 py-[10px]">
          <div className="flex items-center gap-2">
            <Bike size={20} className="text-gray-800" />
            <h2 className="text-lg font-medium">Component Library</h2>
          </div>
        </div>
        
        <div className="mb-4">
          <Tabs defaultValue="marketplace" className="w-full" onValueChange={(value) => setActiveTab(value as 'marketplace' | 'uploads')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="uploads">My Uploads</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input type="search" placeholder="Search components" className="pl-9 bg-gray-50 border-gray-200 rounded-full text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-2 h-36 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'uploads' && filteredUploadedModels.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3">
                  {filteredUploadedModels.map(component => (
                    <div 
                      key={component.id} 
                      onClick={() => handleComponentSelect(component)} 
                      className="bg-gray-50 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors flex flex-col items-center"
                    >
                      <div className="w-full h-24 mb-2 flex items-center justify-center">
                        <img src={component.thumbnail} alt={component.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="text-sm text-center font-medium text-gray-800">{component.name}</span>
                      <span className="text-xs text-center text-gray-500">{component.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'marketplace' && (
              <>
                {!searchQuery && (
                  <>
                    <h3 className="text-sm font-semibold mb-2">Bike Components</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {BIKE_COMPONENTS.slice(0, 10).map(component => (
                        <div 
                          key={component.id} 
                          onClick={() => handleComponentSelect(component)} 
                          className="bg-gray-50 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors flex flex-col items-center"
                        >
                          <div className="w-full h-24 mb-2 flex items-center justify-center">
                            <img src={component.thumbnail} alt={component.name} className="max-h-full max-w-full object-contain" />
                          </div>
                          <span className="text-sm text-center font-medium text-gray-800">{component.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
