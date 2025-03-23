
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bookmark, Trash2, Star, Clock, Filter } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for saved designs
const SAVED_DESIGNS = [
  {
    id: 'design-1',
    name: 'Road Bike Design',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    createdAt: '2023-06-15',
    isFavorite: true
  },
  {
    id: 'design-2',
    name: 'Mountain Bike Concept',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    createdAt: '2023-07-20',
    isFavorite: false
  },
  {
    id: 'design-3',
    name: 'City Commuter Bike',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    createdAt: '2023-08-10',
    isFavorite: true
  },
  {
    id: 'design-4',
    name: 'Racing Bike Setup',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    createdAt: '2023-09-05',
    isFavorite: false
  },
  {
    id: 'design-5',
    name: 'Electric Bike Design',
    thumbnail: '/lovable-uploads/33ad89d2-1cd4-4d22-b944-fd81eb57fd44.png',
    createdAt: '2023-10-12',
    isFavorite: true
  },
];

export interface SavedDesign {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: string;
  isFavorite: boolean;
}

interface SavedSidebarProps {
  onSelectDesign?: (design: SavedDesign) => void;
}

export const SavedSidebar: React.FC<SavedSidebarProps> = ({
  onSelectDesign
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const filteredDesigns = SAVED_DESIGNS.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'favorites' && design.isFavorite);
    return matchesSearch && matchesFilter;
  });

  const handleDesignSelect = (design: SavedDesign) => {
    if (onSelectDesign) {
      onSelectDesign(design);
      toast.success(`Selected design: ${design.name}`);
    }
  };

  const handleToggleFavorite = (designId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would update the state and persist the change
    toast.success(`Toggled favorite status`);
  };

  const handleDeleteDesign = (designId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would remove the design
    toast.success(`Design deleted`);
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-sm rounded-2xl overflow-hidden">
      <div className="p-4 py-0 px-[16px]">
        <div className="flex items-center justify-between gap-2 mb-4 py-[10px]">
          <div className="flex items-center gap-2">
            <Bookmark size={20} className="text-gray-800" />
            <h2 className="text-lg font-medium">Saved Designs</h2>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-black text-white' : ''}
            >
              All
            </Button>
            <Button 
              variant={filter === 'favorites' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('favorites')}
              className={filter === 'favorites' ? 'bg-black text-white' : ''}
            >
              <Star size={16} className="mr-1" />
              Favorites
            </Button>
          </div>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Search saved designs" 
            className="pl-9 bg-gray-50 border-gray-200 rounded-full text-sm" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDesigns.map(design => (
              <div 
                key={design.id} 
                onClick={() => handleDesignSelect(design)} 
                className="group bg-gray-50 hover:bg-gray-100 rounded-lg p-3 cursor-pointer transition-colors"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-16 rounded-md bg-white overflow-hidden flex-shrink-0">
                    <img 
                      src={design.thumbnail} 
                      alt={design.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 truncate">{design.name}</h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={(e) => handleToggleFavorite(design.id, e)}
                        >
                          <Star 
                            size={16} 
                            className={design.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} 
                          />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-red-500" 
                          onClick={(e) => handleDeleteDesign(design.id, e)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock size={12} className="mr-1" />
                      <span>{design.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredDesigns.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bookmark size={40} className="mx-auto mb-3 text-gray-300" />
                <p>No saved designs found</p>
                {searchQuery && (
                  <p className="mt-1 text-sm">Try a different search term</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
