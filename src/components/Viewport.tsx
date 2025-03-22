
import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Layers,
  Box,
  Trash2
} from 'lucide-react';
import { createMockHandlebar, createComponentShape } from '@/utils/threeUtils';
import { ComponentItem } from './Sidebar';

const Handlebar = () => {
  const handlebarRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (handlebarRef.current) {
      const handlebar = createMockHandlebar();
      handlebarRef.current.add(handlebar);
    }
  }, []);
  
  return <group ref={handlebarRef} />;
};

interface PlacedObjectProps {
  component: ComponentItem;
  position: [number, number, number];
  id: string;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

const PlacedObject: React.FC<PlacedObjectProps> = ({ 
  component, 
  position, 
  id, 
  onSelect,
  isSelected
}) => {
  const componentRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (componentRef.current) {
      // Clear any existing children
      while (componentRef.current.children.length > 0) {
        componentRef.current.remove(componentRef.current.children[0]);
      }
      
      // Create the new component mesh
      const componentMesh = createComponentShape(component.shape);
      
      // Add the mesh to the group
      componentRef.current.add(componentMesh);
      
      // Set the position
      componentRef.current.position.set(position[0], position[1], position[2]);
      
      console.log(`Placed component with shape "${component.shape}" at position (${position.join(', ')})`);
    }
  }, [position, component.shape]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(id);
  };

  return (
    <group 
      ref={componentRef} 
      onClick={handleClick}
      userData={{ id }}
    >
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshBasicMaterial color="#ffffff" wireframe={true} />
        </mesh>
      )}
    </group>
  );
};

interface SceneProps {
  placedObjects: Array<{
    id: string;
    component: ComponentItem;
    position: [number, number, number];
  }>;
  onSelectObject: (id: string) => void;
  selectedObjectId: string | null;
  onPlaceObject: (position: [number, number, number]) => void;
}

const Scene: React.FC<SceneProps> = ({ 
  placedObjects, 
  onSelectObject,
  selectedObjectId,
  onPlaceObject
}) => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');

  const handleClick = (event: any) => {
    if (event.point) {
      event.stopPropagation();
      const position: [number, number, number] = [
        event.point.x, 
        event.point.y, 
        event.point.z
      ];
      console.log(`Placing object at position (${position.join(', ')})`);
      onPlaceObject(position);
    }
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 5, 5]} />
      <OrbitControls makeDefault />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={directionalLightRef}
        position={[5, 10, 7.5]}
        intensity={1}
        castShadow
      />
      
      <gridHelper args={[10, 10]} position={[0, -0.01, 0]} />
      <Handlebar />
      
      {/* Render all placed objects */}
      {placedObjects.map((object) => (
        <PlacedObject
          key={object.id}
          id={object.id}
          component={object.component}
          position={object.position}
          onSelect={onSelectObject}
          isSelected={selectedObjectId === object.id}
        />
      ))}
      
      {/* Add a mesh to capture clicks for adding objects */}
      <mesh onClick={handleClick} visible={false}>
        <boxGeometry args={[50, 50, 50]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
};

interface ViewportProps {
  selectedComponent: ComponentItem | null;
  onComponentPlaced: () => void;
}

export const Viewport: React.FC<ViewportProps> = ({ selectedComponent, onComponentPlaced }) => {
  const [placedObjects, setPlacedObjects] = useState<Array<{
    id: string;
    component: ComponentItem;
    position: [number, number, number];
  }>>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  
  useEffect(() => {
    if (selectedComponent) {
      console.log('Viewport: Selected component changed:', selectedComponent.name);
      toast(`Component selected: ${selectedComponent.name}`, {
        description: "Click in the viewport to place the object",
      });
    }
  }, [selectedComponent]);

  const handlePlaceObject = (position: [number, number, number]) => {
    if (selectedComponent) {
      const newId = `object-${Date.now()}`;
      setPlacedObjects([
        ...placedObjects, 
        { 
          id: newId, 
          component: selectedComponent, 
          position 
        }
      ]);
      
      toast.success(`Placed ${selectedComponent.name} at position: ${position.map(n => n.toFixed(2)).join(', ')}`);
      onComponentPlaced();
      console.log(`Added ${selectedComponent.name} at position (${position.join(', ')})`);
    }
  };

  const handleSelectObject = (id: string) => {
    setSelectedObjectId(id === selectedObjectId ? null : id);
    const selected = placedObjects.find(obj => obj.id === id);
    if (selected) {
      toast.info(`Selected ${selected.component.name}`);
      console.log(`Selected object: ${selected.component.name} (${id})`);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedObjectId) {
      const selectedObject = placedObjects.find(obj => obj.id === selectedObjectId);
      setPlacedObjects(placedObjects.filter(obj => obj.id !== selectedObjectId));
      setSelectedObjectId(null);
      if (selectedObject) {
        toast.success(`Deleted ${selectedObject.component.name}`);
        console.log(`Deleted object: ${selectedObject.component.name} (${selectedObjectId})`);
      }
    }
  };

  return (
    <div className="relative flex-1 bg-gray-100 overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm"
          onClick={() => toast.info('Zoom in')}
        >
          <ZoomIn size={18} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm"
          onClick={() => toast.info('Zoom out')}
        >
          <ZoomOut size={18} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm"
          onClick={() => toast.info('Fit to view')}
        >
          <Maximize size={18} />
        </Button>
      </div>
      
      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm text-app-gray">
          <Box size={12} className="text-app-blue" />
          <span>Bike Handlebar.stl</span>
        </div>
      </div>
      
      {placedObjects.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10">
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm text-app-blue">
            <Layers size={12} />
            <span>{placedObjects.length} object{placedObjects.length === 1 ? '' : 's'}</span>
          </div>
        </div>
      )}
      
      {selectedComponent && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm border border-app-blue/20 text-app-blue">
            <Box size={16} />
            <span className="font-medium">{selectedComponent.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-50 ml-2 h-6 px-2"
              onClick={() => {
                onComponentPlaced();
                toast.info('Component selection canceled');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {selectedObjectId && (
        <div className="absolute top-16 right-4 z-10">
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleDeleteSelected}
          >
            <Trash2 size={16} />
            Delete Selected
          </Button>
        </div>
      )}
      
      <Canvas shadows className="w-full h-full outline-none">
        <Scene 
          placedObjects={placedObjects}
          onSelectObject={handleSelectObject}
          selectedObjectId={selectedObjectId}
          onPlaceObject={handlePlaceObject}
        />
      </Canvas>
    </div>
  );
};
