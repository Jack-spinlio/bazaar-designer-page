import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ComponentCard } from './ComponentCard';
import { Search, Bike } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileUploader } from './FileUploader';

// Bike models for the prefabs library
const BIKE_PREFABS = [
  {
    id: 'bike-1',
    name: 'Road bike',
    type: 'BIKE',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    folder: 'Bikes',
    shape: 'box' as const
  },
  {
    id: 'bike-2',
    name: 'Canyon bike',
    type: 'BIKE',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    folder: 'Bikes',
    shape: 'box' as const
  },
  {
    id: 'bike-3',
    name: 'Girls bike',
    type: 'BIKE',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    folder: 'Bikes',
    shape: 'box' as const
  },
  {
    id: 'bike-4',
    name: 'City bike',
    type: 'BIKE',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    folder: 'Bikes',
    shape: 'box' as const
  },
  {
    id: 'bike-5',
    name: 'Electric bike',
    type: 'BIKE',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    folder: 'Bikes',
    shape: 'box' as const
  },
  {
    id: 'bike-6',
    name: 'Classic bike',
    type: 'BIKE',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    folder: 'Bikes',
    shape: 'box' as const
  },
  {
    id: 'bike-7',
    name: 'e-Cargo',
    type: 'BIKE',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    folder: 'Bikes',
    shape: 'box' as const
  },
  {
    id: 'bike-8',
    name: 'e-MTB',
    type: 'BIKE',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    folder: 'Bikes',
    shape: 'box' as const
  },
  {
    id: 'bike-9',
    name: 'City bike',
    type: 'BIKE',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    folder: 'Bikes',
    shape: 'box' as const
  },
  {
    id: 'bike-10',
    name: 'Race bike',
    type: 'BIKE',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    folder: 'Bikes',
    shape: 'box' as const
  }
];

export interface PrefabItem {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  folder?: string;
  shape: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus';
  modelUrl?: string;
}

interface PrefabSidebarProps {
  onSelectPrefab?: (prefab: PrefabItem) => void;
}

export const PrefabSidebar: React.FC<PrefabSidebarProps> = ({
  onSelectPrefab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPrefabs = BIKE_PREFABS.filter(prefab => {
    return prefab.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handlePrefabSelect = (prefab: PrefabItem) => {
    if (onSelectPrefab) {
      onSelectPrefab(prefab);
      toast.success(`Selected prefab: ${prefab.name}`);
    }
  };

  const handleFileUploaded = (newPrefab: PrefabItem) => {
    setIsUploaderOpen(false);
    toast.success(`Prefab "${newPrefab.name}" added to library`);
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-sm rounded-2xl overflow-hidden">
      <div className="p-4 py-0 px-[16px]">
        <div className="flex items-center justify-between gap-2 mb-4 py-[10px]">
          <div className="flex items-center gap-2">
            <Bike size={20} className="text-gray-800" />
            <h2 className="text-lg font-medium">Prefabs</h2>
          </div>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Search prefabs" 
            className="pl-9 bg-gray-50 border-gray-200 rounded-full text-sm" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
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
          <div className="grid grid-cols-2 gap-3">
            {filteredPrefabs.map(prefab => (
              <div 
                key={prefab.id} 
                onClick={() => handlePrefabSelect(prefab)} 
                className="bg-gray-50 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors flex flex-col items-center"
              >
                <div className="w-full h-24 mb-2 flex items-center justify-center">
                  <img 
                    src={prefab.thumbnail} 
                    alt={prefab.name} 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>
                <span className="text-sm text-center font-medium text-gray-800">{prefab.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
