
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FileUploader } from './FileUploader';
import { ComponentCard } from './ComponentCard';
import { 
  Search, 
  FolderOpen, 
  Grid2x2, 
  List, 
  FilePlus,
  FolderPlus,
} from 'lucide-react';
import { toast } from 'sonner';

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
  const [showUploader, setShowUploader] = useState(false);
  
  const filteredComponents = MOCK_COMPONENTS.filter(
    component => component.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComponentSelect = (component: ComponentItem) => {
    if (onSelectComponent) {
      onSelectComponent(component);
      toast.success(`Selected component: ${component.name}`);
    }
  };

  return (
    <div className="h-full flex flex-col border-r border-app-gray-light/20 bg-white">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-medium">Component Library</h2>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="hover:bg-app-blue/10 text-app-gray-dark hover:text-app-blue"
          >
            {viewMode === 'grid' ? <List size={18} /> : <Grid2x2 size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowUploader(true)}
            className="hover:bg-app-blue/10 text-app-gray-dark hover:text-app-blue"
          >
            <FilePlus size={18} />
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-app-gray-light" />
          <Input
            type="search"
            placeholder="Search components..."
            className="pl-9 bg-app-gray-lighter border-app-gray-light/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="flex-1 overflow-hidden">
        <div className="px-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
            <TabsTrigger value="folders" className="flex-1">Folders</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="flex-1 overflow-auto p-4 mt-0">
          {showUploader ? (
            <FileUploader onClose={() => setShowUploader(false)} />
          ) : (
            <>
              {filteredComponents.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-2 gap-4" 
                  : "flex flex-col gap-2"
                }>
                  {filteredComponents.map(component => (
                    <ComponentCard 
                      key={component.id}
                      component={component}
                      viewMode={viewMode}
                      onSelect={() => handleComponentSelect(component)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-app-gray-light">
                  <p className="mb-2">No components found</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowUploader(true)}
                    className="mt-2"
                  >
                    Upload Component
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="recent" className="flex-1 overflow-auto p-4 mt-0">
          <div className="flex flex-col items-center justify-center h-full text-app-gray-light">
            <p>No recent components</p>
          </div>
        </TabsContent>

        <TabsContent value="folders" className="flex-1 overflow-auto p-4 mt-0">
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="flex justify-start items-center gap-2 text-app-gray-dark">
              <FolderOpen size={18} className="text-app-blue" />
              <span>Bike Parts</span>
              <span className="ml-auto text-xs text-app-gray-light">5</span>
            </Button>
            
            <Button variant="ghost" className="flex justify-start items-center gap-2 text-app-gray">
              <FolderPlus size={18} />
              <span>Create New Folder</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
