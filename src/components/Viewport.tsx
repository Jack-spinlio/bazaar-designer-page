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
import { loadModel } from '@/utils/modelLoader';
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
      
      // Check if we have a model URL to load
      if (component.modelUrl && (component.type === 'STL' || component.type === 'OBJ')) {
        console.log(`Loading ${component.type} model from ${component.modelUrl}`);
        
        // Load the STL or OBJ model
        loadModel(component.modelUrl, component.type)
          .then(model => {
            if (componentRef.current) {
              // Center and scale the model
              const box = new THREE.Box3().setFromObject(model);
              const size = new THREE.Vector3();
              box.getSize(size);
              
              // Scale to a reasonable size (about 1 unit)
              const maxDim = Math.max(size.x, size.y, size.z);
              if (maxDim > 0) {
                const scale = 1 / maxDim;
                model.scale.set(scale, scale, scale);
              }
              
              // Add to the group
              componentRef.current.add(model);
            }
          })
          .catch(error => {
            console.error('Error loading model:', error);
            // Fallback to basic shape if model loading fails
            const componentMesh = createComponentShape(component.shape);
            componentRef.current?.add(componentMesh);
          });
      } else {
        // Create the standard component mesh for basic shapes
        const componentMesh = createComponentShape(component.shape);
        componentRef.current.add(componentMesh);
        console.log(`Created basic shape "${component.shape}" for component "${component.name}"`);
      }
      
      // Set the position
      componentRef.current.position.set(position[0], position[1], position[2]);
      
      console.log(`Placed component "${component.name}" at position (${position.join(', ')})`);
    }
  }, [position, component]);

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
      
      toast.success(`Placed ${selectedComponent.name}`);
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
          className="bg-white/90 backdrop-blur-sm"
          onClick={() => toast.info('Zoom in')}
        >
          <ZoomIn size={18} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm"
          onClick={() => toast.info('Zoom out')}
        >
          <ZoomOut size={18} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm"
          onClick={() => toast.info('Fit to view')}
        >
          <Maximize size={18} />
        </Button>
      </div>
      
      {selectedObjectId && (
        <div className="absolute top-4 right-4 z-10">
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
