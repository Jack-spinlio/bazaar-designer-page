import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
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
import { createSnapPointIndicator, createMockHandlebar } from '@/utils/threeUtils';

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
}

const SnapPoint: React.FC<SnapPointProps> = ({ 
  position, 
  type, 
  color = '#0ea5e9',
  selected = false
}) => {
  const snapPointRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (snapPointRef.current) {
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

  return <group ref={snapPointRef} />;
};

const Scene = () => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');

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
      
      <SnapPoint position={[-2, 0, 0]} type="plane" selected={true} />
      <SnapPoint position={[2, 0, 0]} type="plane" />
      <SnapPoint position={[0, -0.3, 0]} type="point" />
    </>
  );
};

export const Viewport: React.FC = () => {
  const [mode, setMode] = useState<'view' | 'add'>('view');
  
  const handleAddSnapPoint = () => {
    setMode(mode === 'add' ? 'view' : 'add');
    toast.info(mode === 'add' 
      ? 'Exited snap point placement mode' 
      : 'Click on the model to place a snap point'
    );
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
          onClick={() => toast.info('Add surface plane')}
        >
          <Layers size={16} className="mr-2" />
          Add Surface
        </Button>
      </div>
      
      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm text-app-gray">
          <Box size={12} className="text-app-blue" />
          <span>Bike Handlebar.stl</span>
        </div>
      </div>
      
      <Canvas shadows className="w-full h-full outline-none">
        <Scene />
      </Canvas>
    </div>
  );
};
