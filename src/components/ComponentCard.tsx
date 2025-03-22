
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  FileAxis3d,
  MapPin,
  Box,
  Circle,
  Cylinder,
  Cone,
  CircleDot
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ComponentItem } from './Sidebar';

interface ComponentCardProps {
  component: ComponentItem;
  viewMode: 'grid' | 'list';
  onSelect?: () => void;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  viewMode,
  onSelect
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleLoad = () => {
    console.log('ComponentCard: handleLoad called for', component.name);
    if (onSelect) {
      onSelect();
    } else {
      toast.success(`Loaded component: ${component.name}`);
    }
  };

  const getShapeIcon = (shape: string) => {
    switch(shape) {
      case 'box': return <Box size={16} className="text-app-blue" />;
      case 'sphere': return <Circle size={16} className="text-app-blue" />;
      case 'cylinder': return <Cylinder size={16} className="text-app-blue" />;
      case 'cone': return <Cone size={16} className="text-app-blue" />;
      case 'torus': return <CircleDot size={16} className="text-app-blue" />;
      default: return <FileAxis3d size={16} className="text-app-blue" />;
    }
  };

  if (viewMode === 'grid') {
    return (
      <div 
        className="group relative overflow-hidden rounded-lg border border-app-gray-light/20 bg-white transition-all duration-200 hover:shadow-md hover:border-app-blue/30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-square relative overflow-hidden bg-app-gray-lighter flex items-center justify-center">
          {component.type === 'SHAPE' ? (
            <div className="w-16 h-16 flex items-center justify-center">
              {getShapeIcon(component.shape)}
            </div>
          ) : (
            <img
              src={component.thumbnail}
              alt={component.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button 
              onClick={handleLoad}
              variant="default"
              size="sm"
              className="bg-app-blue hover:bg-app-blue-light text-white"
            >
              Place on Snap Point
            </Button>
          </div>
        </div>
        
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <div className="flex items-center gap-1">
                {getShapeIcon(component.shape)}
                <p className="text-sm font-medium truncate">{component.name}</p>
              </div>
              <p className="text-xs text-app-gray-light">{component.type}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal size={14} />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-app-gray-lighter">
      <div className="h-10 w-10 rounded bg-app-gray-lighter flex items-center justify-center">
        {getShapeIcon(component.shape)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{component.name}</p>
        <p className="text-xs text-app-gray-light">{component.type}</p>
      </div>
      <div className="flex gap-1">
        <Button 
          onClick={handleLoad}
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hover:bg-app-blue/10 hover:text-app-blue"
        >
          <MapPin size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
        >
          <MoreHorizontal size={16} />
        </Button>
      </div>
    </div>
  );
};
