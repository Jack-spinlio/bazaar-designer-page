import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import {
  Maximize,
  Layers,
  Box,
  Trash2
} from 'lucide-react';
import { createComponentShape } from '@/utils/threeUtils';
import { loadModel } from '@/utils/modelLoader';
import { ComponentItem } from './Sidebar';
import { useLocation } from 'react-router-dom';

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
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  useEffect(() => {
    if (componentRef.current) {
      // Clear any existing children
      while (componentRef.current.children.length > 0) {
        componentRef.current.remove(componentRef.current.children[0]);
      }
      
      // Check if we have a model URL to load
      if (component.modelUrl && (component.type === 'STL' || component.type === 'OBJ' || component.type === 'STP' || component.type === 'STEP')) {
        console.log(`Loading ${component.type} model from ${component.modelUrl}`);
        setIsLoading(true);
        setLoadError(null);
        
        // Load the model
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
              toast.success(`Loaded ${component.name} model`);
            }
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error loading model:', error);
            setLoadError(`Failed to load ${component.type} model`);
            toast.error(`Failed to load ${component.name} model`);
            
            // Fallback to basic shape if model loading fails
            const componentMesh = createComponentShape(component.shape);
            if (componentRef.current) {
              componentRef.current.add(componentMesh);
            }
            setIsLoading(false);
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
      {isLoading && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#3b82f6" wireframe={true} />
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
  const [hasLoadedCM18, setHasLoadedCM18] = useState(false);
  const location = useLocation();
  const isEditPage = location.pathname === '/edit';
  
  useEffect(() => {
    if (!hasLoadedCM18) {
      try {
        // Create a simple cube component instead of trying to load a potentially problematic STL
        const cm18Component: ComponentItem = {
          id: 'cm18-default',
          name: 'CM18 3D Model',
          type: 'box', // Use a basic shape type instead of STL
          thumbnail: '/placeholder.svg',
          folder: 'Default Models',
          shape: 'box', // Basic cube shape is more reliable than loading a file
          // No modelUrl - we'll use the basic shape instead
        };
        
        // Place it at a default position
        setPlacedObjects([
          { 
            id: `cm18-${Date.now()}`, 
            component: cm18Component, 
            position: [0, 0, 0] 
          }
        ]);
        
        setHasLoadedCM18(true);
        toast.success('Default CM18 model loaded as a basic shape');
        
        // Also load a sample box component to demonstrate working Three.js rendering
        const boxComponent: ComponentItem = {
          id: 'sample-box',
          name: 'Sample Box',
          type: 'box',
          thumbnail: '/placeholder.svg',
          folder: 'Sample Components',
          shape: 'box',
        };
        
        // Place it next to the CM18 model
        setPlacedObjects(prev => [
          ...prev,
          { 
            id: `box-${Date.now()}`, 
            component: boxComponent, 
            position: [1.5, 0, 0] 
          }
        ]);
      } catch (error) {
        console.error('Error loading default models:', error);
        toast.error('Failed to load default models');
      }
    }
  }, [hasLoadedCM18]);
  
  useEffect(() => {
    if (selectedComponent) {
      console.log('Viewport: Selected component changed:', selectedComponent.name);
      toast.info(`Component selected: ${selectedComponent.name}`, {
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
    } else {
      toast.info("Please select a component from the library first");
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
    <div className="relative flex-1 bg-white overflow-hidden rounded-2xl">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm"
          onClick={() => toast.info('Fit to view')}
        >
          <Maximize size={16} />
          <span>Fit to View</span>
        </Button>
      </div>
      
      {selectedObjectId && (
        <div className="absolute top-4 left-4 z-10">
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
      
      {!isEditPage && selectedComponent && (
        <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 w-auto max-w-lg bg-black/70 text-white px-6 py-3 rounded-full text-sm z-10">
          {`Selected: ${selectedComponent.name} - Click in the viewport to place`}
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
