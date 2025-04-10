import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ComponentCard } from './ComponentCard';
import { Search, Bike } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SHIMANO_COMPONENTS = [
  {
    id: 'shimano-1',
    name: 'Shimano 105 Front Calliper',
    type: 'BRAKE',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/105%20front%20calliper.jpeg',
    folder: 'Brakes',
    shape: 'box' as const
  },
  {
    id: 'shimano-2',
    name: 'Shimano 105 Rear Hub',
    type: 'HUB',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/105%20hub.jpeg',
    folder: 'Wheels',
    shape: 'cylinder' as const
  },
  {
    id: 'shimano-3',
    name: 'Shimano Steps 504Wh Battery',
    type: 'BATTERY',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/504wh.jpeg',
    folder: 'eBike',
    shape: 'box' as const
  },
  {
    id: 'shimano-4',
    name: 'Shimano 630Wh Battery',
    type: 'BATTERY',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/630wh.jpeg',
    folder: 'eBike',
    shape: 'box' as const
  },
  {
    id: 'shimano-5',
    name: 'Shimano XTR Cassette',
    type: 'DRIVETRAIN',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/cassette.jpeg',
    folder: 'Drivetrain',
    shape: 'cylinder' as const
  },
  {
    id: 'shimano-6',
    name: 'Shimano CUES Road Bike Lever',
    type: 'CONTROL',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/CUES%20lever.jpeg',
    folder: 'Controls',
    shape: 'box' as const
  },
  {
    id: 'shimano-7',
    name: 'Shimano Di2 Switch',
    type: 'CONTROL',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/Di2%20Switch.jpeg',
    folder: 'Controls',
    shape: 'box' as const
  },
  {
    id: 'shimano-8',
    name: 'Shimano STEPS Switch',
    type: 'CONTROL',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/disp.jpeg',
    folder: 'eBike',
    shape: 'box' as const
  },
  {
    id: 'shimano-9',
    name: 'Shimano Dura-Ace Calliper',
    type: 'BRAKE',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/Dura-ace%20calliper.jpeg',
    folder: 'Brakes',
    shape: 'box' as const
  },
  {
    id: 'shimano-10',
    name: 'Shimano EP8 Motor',
    type: 'MOTOR',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/EP8.jpeg',
    folder: 'eBike',
    shape: 'box' as const,
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models/1742796907092_Shimano_Ep800.stl',
    modelType: 'STL'
  },
  {
    id: 'shimano-11',
    name: 'Shimano GRX Pedals',
    type: 'PEDAL',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/GRX%20Pedals.jpeg',
    folder: 'Drivetrain',
    shape: 'box' as const
  },
  {
    id: 'shimano-12',
    name: 'Shimano GRX Shifters',
    type: 'CONTROL',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/GRX%20shifter.jpeg',
    folder: 'Controls',
    shape: 'box' as const
  },
  {
    id: 'shimano-13',
    name: 'Shimano eBike Display',
    type: 'DISPLAY',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/sim%20disp.jpeg',
    folder: 'eBike',
    shape: 'box' as const
  },
  {
    id: 'shimano-14',
    name: 'Shimano XTR Derailleur',
    type: 'DRIVETRAIN',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/xrt%20di2%20deralier.jpeg',
    folder: 'Drivetrain',
    shape: 'box' as const
  },
  {
    id: 'shimano-15',
    name: 'Shimano XTR Lever',
    type: 'CONTROL',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images/xtra%20lever.jpeg',
    folder: 'Controls',
    shape: 'box' as const
  }
];

const BASIC_SHAPES = [
  {
    id: 'shape-1',
    name: 'Box',
    type: 'SHAPE',
    thumbnail: '/placeholder.svg',
    folder: 'Basic Shapes',
    shape: 'box' as const
  },
  {
    id: 'shape-2',
    name: 'Sphere',
    type: 'SHAPE',
    thumbnail: '/placeholder.svg',
    folder: 'Basic Shapes',
    shape: 'sphere' as const
  },
  {
    id: 'shape-3',
    name: 'Cylinder',
    type: 'SHAPE',
    thumbnail: '/placeholder.svg',
    folder: 'Basic Shapes',
    shape: 'cylinder' as const
  },
  {
    id: 'shape-4',
    name: 'Cone',
    type: 'SHAPE',
    thumbnail: '/placeholder.svg',
    folder: 'Basic Shapes',
    shape: 'cone' as const
  },
  {
    id: 'shape-5',
    name: 'Torus',
    type: 'SHAPE',
    thumbnail: '/placeholder.svg',
    folder: 'Basic Shapes',
    shape: 'torus' as const
  }
];

const CUSTOM_COMPONENTS = [
  {
    id: 'shimano-ep800-uploaded',
    name: 'Shimano Ep800',
    type: 'STL',
    thumbnail: '/placeholder.svg',
    folder: 'Uploads',
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models/1742796907092_Shimano_Ep800.stl',
    modelType: 'STL',
    shape: 'box' as const
  },
  {
    id: 'custom-fork-1',
    name: 'Front Fork',
    type: 'OBJ',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//fork.png',
    folder: 'Custom Components',
    shape: 'box' as const,
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//Fork.obj'
  },
  {
    id: 'custom-frame-1',
    name: 'Modmo Saigon Frame',
    type: 'GLTF',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//Modmo.webp',
    folder: 'Custom Components',
    shape: 'box' as const,
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//Frame.gltf'
  },
  {
    id: 'kingmeter-handlebar',
    name: 'King-Meter Handlebar',
    type: 'GLTF',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//King-Meter%20integrated.png',
    folder: 'Custom Components',
    shape: 'box' as const,
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//Handlebar+HeadLight+SpeedController.gltf',
    modelType: 'GLTF'
  },
  {
    id: 'complete-bike',
    name: "Men's Urban eBike",
    type: 'GLTF',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails/complete_bike.jpg',
    folder: 'Bikes',
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models/CompleteBike.gltf',
    modelType: 'GLTF',
    shape: 'box' as const
  }
];

export interface ComponentItem {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  folder?: string;
  shape: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus';
  modelUrl?: string;
  modelType?: string;
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
  const [components, setComponents] = useState<ComponentItem[]>([...SHIMANO_COMPONENTS, ...BASIC_SHAPES, ...CUSTOM_COMPONENTS]);
  const [uploadedModels, setUploadedModels] = useState<ComponentItem[]>([...CUSTOM_COMPONENTS]);
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
          const modelComponents: ComponentItem[] = data.map(file => {
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

          // Add the King Meter K5347 component
          const kingMeterComponent: ComponentItem = {
            id: 'king-meter-k5347',
            name: 'King Meter K5347',
            type: 'STEP',
            thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//King-Meter%20K5347.png',
            folder: 'Uploads',
            shape: 'box' as const,
            modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//K5347%20Integrated%203D%20Drawings%2020240220(1)%20(1).STEP'
          };
          
          console.log("Custom components:", CUSTOM_COMPONENTS);
          
          // Ensure custom components are included in both arrays
          setUploadedModels([...CUSTOM_COMPONENTS, kingMeterComponent, ...modelComponents]);
          
          // Update components without duplicating
          const filteredComponents = components.filter(comp => 
            !comp.id.startsWith('supabase-') && 
            !comp.id.startsWith('uploaded-') && 
            comp.id !== 'king-meter-k5347' &&
            !CUSTOM_COMPONENTS.some(custom => custom.id === comp.id)
          );
          setComponents([...filteredComponents, ...CUSTOM_COMPONENTS, kingMeterComponent, ...modelComponents]);
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
    console.log('Component details:', component);
    if (onSelectComponent) {
      onSelectComponent(component);
      toast.success(`Selected component: ${component.name}`);
    }
  };

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
            
            <TabsContent value="marketplace" className="max-h-[calc(100vh-180px)]">
              <div className="relative my-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input type="search" placeholder="Search components" className="pl-9 bg-gray-50 border-gray-200 rounded-full text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              
              <ScrollArea className="h-[calc(100vh-240px)]">
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((_, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-2 h-36 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pr-2">
                    {SHIMANO_COMPONENTS.map(component => (
                      <div 
                        key={component.id} 
                        onClick={() => handleComponentSelect(component)} 
                        className="bg-gray-50 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors flex flex-col items-center"
                      >
                        <div className="w-full h-24 mb-2">
                          <img src={component.thumbnail} alt={component.name} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <span className="text-sm text-center font-medium text-gray-800">{component.name}</span>
                        <span className="text-xs text-center text-gray-500">{component.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="uploads" className="max-h-[calc(100vh-180px)]">
              <div className="relative my-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input type="search" placeholder="Search components" className="pl-9 bg-gray-50 border-gray-200 rounded-full text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              
              <ScrollArea className="h-[calc(100vh-240px)]">
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((_, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-2 h-36 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pr-2">
                    {filteredUploadedModels.map(component => (
                      <div 
                        key={component.id} 
                        onClick={() => handleComponentSelect(component)} 
                        className="bg-gray-50 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors flex flex-col items-center"
                      >
                        <div className="w-full h-24 mb-2">
                          <img src={component.thumbnail} alt={component.name} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <span className="text-sm text-center font-medium text-gray-800">{component.name}</span>
                        <span className="text-xs text-center text-gray-500">{component.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
