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
  Crosshair,
  MapPin,
  Layers,
  Box
} from 'lucide-react';
import { createSnapPointIndicator, createMockHandlebar, createComponentShape } from '@/utils/threeUtils';
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

interface SnapPointProps {
  position: [number, number, number];
  type: 'point' | 'plane';
  color?: string;
  selected?: boolean;
  component?: ComponentItem;
  onSelect?: () => void;
}

interface PlacedComponentProps {
  position: [number, number, number];
  shape: string;
}

const PlacedComponent: React.FC<PlacedComponentProps> = ({ position, shape }) => {
  const componentRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (componentRef.current) {
      // Clear any existing children
      while (componentRef.current.children.length > 0) {
        componentRef.current.remove(componentRef.current.children[0]);
      }
      
      // Create the new component mesh
      const componentMesh = createComponentShape(shape);
      
      // Add the mesh to the group
      componentRef.current.add(componentMesh);
      
      // Set the position
      componentRef.current.position.set(position[0], position[1], position[2]);
      
      console.log(`Placed component with shape "${shape}" at position (${position.join(', ')})`);
      
      // Add a debug box to visualize the component bounds
      const box = new THREE.Box3().setFromObject(componentMesh);
      const boxHelper = new THREE.Box3Helper(box, new THREE.Color(0xff0000));
      componentRef.current.add(boxHelper);
    }
  }, [position, shape]);

  return <group ref={componentRef} />;
};

const SnapPoint: React.FC<SnapPointProps> = ({ 
  position, 
  type, 
  color = '#0ea5e9',
  selected = false,
  component,
  onSelect
}) => {
  const snapPointRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (snapPointRef.current) {
      // Clear any existing children
      while (snapPointRef.current.children.length > 0) {
        snapPointRef.current.remove(snapPointRef.current.children[0]);
      }
      
      const pos = new THREE.Vector3(...position);
      const indicator = createSnapPointIndicator(new THREE.Vector3(0, 0, 0), type);
      
      const scale = selected ? 1.5 : 1;
      indicator.scale.set(scale, scale, scale);
      
      snapPointRef.current.add(indicator);
      snapPointRef.current.position.copy(pos);
    }
  }, [position, type, selected]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    console.log(`Snap point clicked at position (${position.join(', ')})`);
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <group ref={snapPointRef} onClick={handleClick}>
      {component && (
        <PlacedComponent position={position} shape={component.shape} />
      )}
    </group>
  );
};

interface SceneProps {
  mode: 'view' | 'add';
  onAddSnapPoint: (position: [number, number, number]) => void;
  customSnapPoints: SnapPointProps[];
  onSelectSnapPoint: (index: number) => void;
  selectedSnapPointIndex: number | null;
  selectedComponent: ComponentItem | null;
}

const Scene: React.FC<SceneProps> = ({ 
  mode, 
  onAddSnapPoint, 
  customSnapPoints, 
  onSelectSnapPoint,
  selectedSnapPointIndex,
  selectedComponent
}) => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');

  const handleClick = (event: any) => {
    if (mode === 'add' && event.point) {
      event.stopPropagation();
      onAddSnapPoint([event.point.x, event.point.y, event.point.z]);
    }
  };

  useEffect(() => {
    if (selectedComponent) {
      console.log('Scene: Selected component changed:', selectedComponent.name);
    }
  }, [selectedComponent]);

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
      
      {/* Default snap points */}
      <SnapPoint 
        position={[-2, 0, 0]} 
        type="plane" 
        selected={selectedSnapPointIndex === -3}
        onSelect={() => onSelectSnapPoint(-3)}
        component={selectedSnapPointIndex === -3 && selectedComponent ? selectedComponent : undefined}
      />
      <SnapPoint 
        position={[2, 0, 0]} 
        type="plane" 
        selected={selectedSnapPointIndex === -2}
        onSelect={() => onSelectSnapPoint(-2)}
        component={selectedSnapPointIndex === -2 && selectedComponent ? selectedComponent : undefined}
      />
      <SnapPoint 
        position={[0, -0.3, 0]} 
        type="point" 
        selected={selectedSnapPointIndex === -1}
        onSelect={() => onSelectSnapPoint(-1)}
        component={selectedSnapPointIndex === -1 && selectedComponent ? selectedComponent : undefined}
      />
      
      {/* User added snap points */}
      {customSnapPoints.map((point, index) => (
        <SnapPoint 
          key={index}
          position={point.position}
          type={point.type}
          selected={selectedSnapPointIndex === index}
          component={point.component || (selectedSnapPointIndex === index && selectedComponent ? selectedComponent : undefined)}
          onSelect={() => onSelectSnapPoint(index)}
        />
      ))}
    </>
  );
};

interface ViewportProps {
  selectedComponent: ComponentItem | null;
  onComponentPlaced: () => void;
}

export const Viewport: React.FC<ViewportProps> = ({ selectedComponent, onComponentPlaced }) => {
  const [mode, setMode] = useState<'view' | 'add'>('view');
  const [snapPoints, setSnapPoints] = useState<SnapPointProps[]>([]);
  const [selectedPointType, setSelectedPointType] = useState<'point' | 'plane'>('point');
  const [selectedSnapPointIndex, setSelectedSnapPointIndex] = useState<number | null>(null);
  
  useEffect(() => {
    if (selectedComponent) {
      console.log('Viewport: Selected component changed:', selectedComponent.name);
      toast(`Component selected: ${selectedComponent.name}`, {
        description: "Click on a snap point to place it",
      });
    }
  }, [selectedComponent]);

  const handleAddSnapPoint = () => {
    setMode(mode === 'add' ? 'view' : 'add');
    toast(mode === 'add' 
      ? 'Exited snap point placement mode' 
      : `Click on the model to place a ${selectedPointType}`
    );
  };

  const handleSnapPointPlaced = (position: [number, number, number]) => {
    const newPoint: SnapPointProps = {
      position,
      type: selectedPointType,
      selected: false
    };
    
    setSnapPoints([...snapPoints, newPoint]);
    toast(`${selectedPointType === 'point' ? 'Snap point' : 'Snap plane'} added at position: ${position.map(n => n.toFixed(2)).join(', ')}`);
    setMode('view');
  };

  const togglePointType = () => {
    setSelectedPointType(selectedPointType === 'point' ? 'plane' : 'point');
    toast(`Selected snap type: ${selectedPointType === 'point' ? 'Plane' : 'Point'}`);
  };

  const handleSelectSnapPoint = (index: number) => {
    console.log(`Snap point selected, index: ${index}, component selected: ${selectedComponent?.name || 'none'}`);
    setSelectedSnapPointIndex(index);
    
    if (index >= 0) {
      toast(`Selected snap point at position: ${snapPoints[index].position.map(n => n.toFixed(2)).join(', ')}`);
    } else if (index === -3) {
      toast('Selected left grip mount');
    } else if (index === -2) {
      toast('Selected right grip mount');
    } else if (index === -1) {
      toast('Selected stem clamp');
    }
    
    // If we have a component selected, attach it to this snap point
    if (selectedComponent && index !== null) {
      if (index >= 0) {
        // Update user-added snap point
        const updatedSnapPoints = [...snapPoints];
        updatedSnapPoints[index] = {
          ...updatedSnapPoints[index],
          component: selectedComponent
        };
        setSnapPoints(updatedSnapPoints);
        toast.success(`Added ${selectedComponent.name} to snap point`);
        
        // Tell the parent that we've placed the component
        onComponentPlaced();
      } else if (index === -3 || index === -2 || index === -1) {
        // Create a new snap point at the position of the default snap point with the component attached
        let position: [number, number, number] = [0, 0, 0];
        
        if (index === -3) position = [-2, 0, 0];
        else if (index === -2) position = [2, 0, 0];
        else if (index === -1) position = [0, -0.3, 0];
        
        const newPoint: SnapPointProps = {
          position,
          type: index === -1 ? 'point' : 'plane',
          component: selectedComponent
        };
        
        setSnapPoints([...snapPoints, newPoint]);
        toast.success(`Added ${selectedComponent.name} to default snap point`);
        
        // Tell the parent that we've placed the component
        onComponentPlaced();
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
      
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant={mode === 'add' ? 'default' : 'outline'}
          size="sm"
          className={mode === 'add' ? 'bg-app-blue text-white' : 'bg-white/80 backdrop-blur-sm'}
          onClick={handleAddSnapPoint}
        >
          {mode === 'add' ? <Crosshair size={16} className="mr-2" /> : <MapPin size={16} className="mr-2" />}
          {mode === 'add' ? 'Cancel' : 'Add Snap Point'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm"
          onClick={togglePointType}
        >
          {selectedPointType === 'point' ? 
            <MapPin size={16} className="mr-2" /> : 
            <Layers size={16} className="mr-2" />
          }
          {selectedPointType === 'point' ? 'Point' : 'Plane'}
        </Button>
      </div>
      
      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm text-app-gray">
          <Box size={12} className="text-app-blue" />
          <span>Bike Handlebar.stl</span>
        </div>
      </div>
      
      {snapPoints.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10">
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm text-app-blue">
            <MapPin size={12} />
            <span>{snapPoints.length} snap {snapPoints.length === 1 ? 'point' : 'points'} added</span>
          </div>
        </div>
      )}
      
      {selectedComponent && (
        <div className="absolute top-16 right-4 z-10">
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
      
      <Canvas shadows className="w-full h-full outline-none">
        <Scene 
          mode={mode} 
          onAddSnapPoint={handleSnapPointPlaced} 
          customSnapPoints={snapPoints}
          onSelectSnapPoint={handleSelectSnapPoint}
          selectedSnapPointIndex={selectedSnapPointIndex}
          selectedComponent={selectedComponent}
        />
      </Canvas>
    </div>
  );
};
