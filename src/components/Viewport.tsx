import React, { useEffect, useRef, useState } from 'react';
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
  Trash2,
  Crosshair
} from 'lucide-react';
import { createComponentShape } from '@/utils/threeUtils';
import { loadModel } from '@/utils/modelLoader';
import { ComponentItem } from './Sidebar';
import { useLocation } from 'react-router-dom';
import { SnapPointEditor, SnapPoint } from './SnapPointEditor';
import { StepFileViewer } from './StepFileViewer';

interface PlacedObjectProps {
  component: ComponentItem;
  position: [number, number, number];
  id: string;
  onSelect: (id: string) => void;
  isSelected: boolean;
  isSnapPointMode: boolean;
}

const PlacedObject: React.FC<PlacedObjectProps> = ({ 
  component, 
  position, 
  id, 
  onSelect,
  isSelected,
  isSnapPointMode
}) => {
  const componentRef = useRef<THREE.Group>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  
  useEffect(() => {
    if (componentRef.current) {
      while (componentRef.current.children.length > 0) {
        componentRef.current.remove(componentRef.current.children[0]);
      }
      
      const modelType = component.modelType || 
                        (component.modelUrl ? component.modelUrl.split('.').pop()?.toUpperCase() : component.type);
      
      console.log(`Component ${component.name} has model type: ${modelType}`);
      console.log(`Component details:`, component);
      
      if (component.modelUrl && (
          modelType === 'STL' || 
          modelType === 'OBJ' || 
          modelType === 'STP' || 
          modelType === 'STEP' ||
          modelType === 'GLB' ||
          modelType === 'GLTF'
        )) {
        console.log(`Loading ${modelType} model from ${component.modelUrl}`);
        setIsLoading(true);
        setLoadError(null);
        
        let modelUrl = component.modelUrl;
        if (modelUrl.includes('1742796907092_Shimano_Ep800.stl')) {
          modelUrl = `${modelUrl}?t=${Date.now()}`;
          console.log(`Using cache-busted URL for Shimano model: ${modelUrl}`);
        }
        
        loadModel(modelUrl, modelType as any)
          .then(model => {
            if (componentRef.current) {
              const box = new THREE.Box3().setFromObject(model);
              const size = new THREE.Vector3();
              box.getSize(size);
              
              console.log("Original model dimensions:", size);
              
              const targetWidth = component.folder === 'Bikes' ? 1.8 : 0.9;
              const targetHeight = component.folder === 'Bikes' ? 1.5 : 1.3;
              const targetLength = component.folder === 'Bikes' ? 3.0 : 2.0;
              
              const maxDim = Math.max(size.x, size.y, size.z);
              const targetMaxDim = Math.max(targetWidth, targetHeight, targetLength);
              
              if (maxDim > 0) {
                const scale = targetMaxDim / maxDim;
                model.scale.set(scale, scale, scale);
                
                const newBox = new THREE.Box3().setFromObject(model);
                const newSize = new THREE.Vector3();
                newBox.getSize(newSize);
                console.log("Scaled model dimensions:", newSize);
              }
              
              model.position.set(0, 0, 0);
              
              model.userData = { 
                ...model.userData, 
                componentId: id, 
                componentName: component.name,
                isComponent: true
              };
              
              model.traverse(child => {
                if (child instanceof THREE.Object3D) {
                  child.userData = { 
                    ...child.userData, 
                    componentId: id, 
                    componentName: component.name 
                  };
                }
              });
              
              componentRef.current.add(model);
              
              if (modelType === 'STEP' || modelType === 'STP') {
                toast.info(`${component.name} loaded as placeholder (STEP format)`, {
                  description: "STEP files display as placeholders in the 3D viewport",
                  duration: 5000,
                });
              } else {
                toast.success(`Model ${component.name} loaded successfully`);
              }
            }
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error loading model:', error);
            setLoadError(`Failed to load ${modelType} model: ${error.message || 'Unknown error'}`);
            toast.error(`Failed to load model: ${error.message || 'Unknown error'}`);
            
            if (component.modelUrl.includes('1742796907092_Shimano_Ep800.stl') && loadAttempt < 2) {
              console.log(`Retrying Shimano model load, attempt ${loadAttempt + 1}`);
              setLoadAttempt(prev => prev + 1);
              setTimeout(() => {
                if (componentRef.current) {
                  const shimanoPlaceholder = createComponentShape('box');
                  shimanoPlaceholder.scale.set(1.0, 0.8, 0.6);
                  shimanoPlaceholder.userData = { 
                    componentId: id, 
                    componentName: component.name,
                    isComponent: true,
                    isPlaceholder: true,
                    originalModelUrl: component.modelUrl
                  };
                  componentRef.current.add(shimanoPlaceholder);
                  toast.info(`Loaded placeholder for ${component.name}`);
                }
                setIsLoading(false);
              }, 500);
              return;
            }
            
            const componentMesh = createComponentShape(component.shape || 'box');
            componentMesh.userData = { 
              componentId: id, 
              componentName: component.name,
              isComponent: true
            };
            if (componentRef.current) {
              componentRef.current.add(componentMesh);
            }
            setIsLoading(false);
          });
      } else {
        const componentMesh = createComponentShape(component.shape || 'box');
        componentMesh.userData = { 
          componentId: id, 
          componentName: component.name,
          isComponent: true
        };
        
        if (component.shape === 'box') {
          componentMesh.scale.set(2.0, 1.3, 0.9);
        }
        
        if (componentRef.current) {
          componentRef.current.add(componentMesh);
        }
        console.log(`Created basic shape "${component.shape}" for component "${component.name}"`);
      }
      
      componentRef.current.position.set(position[0], position[1], position[2]);
      componentRef.current.userData = {
        componentId: id,
        componentName: component.name,
        isComponent: true
      };
      
      console.log(`Placed component "${component.name}" at position (${position.join(', ')})`);
    }
  }, [component, position, id, loadAttempt]);

  const handleClick = (e: any) => {
    if (isSnapPointMode) {
      return;
    }
    
    e.stopPropagation();
    onSelect(id);
    console.log(`Selected object ID: ${id}`);
  };

  return (
    <group 
      ref={componentRef} 
      onClick={handleClick}
      userData={{ id, componentId: id, componentName: component.name, isComponent: true }}
    >
      {isSelected && !isSnapPointMode && (
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
  snapPoints: SnapPoint[];
  isSnapPointMode: boolean;
  onSnapPointAdded: (snapPoint: SnapPoint) => void;
  selectedSnapPointId: string | null;
  onSelectSnapPoint: (id: string | null) => void;
}

const Scene: React.FC<SceneProps> = ({ 
  placedObjects, 
  onSelectObject,
  selectedObjectId,
  onPlaceObject,
  snapPoints,
  isSnapPointMode,
  onSnapPointAdded,
  selectedSnapPointId,
  onSelectSnapPoint
}) => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');

  const handleClick = (event: any) => {
    if (isSnapPointMode) return;
    
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

  const handleSnapPointAdded = (position: THREE.Vector3, normal?: THREE.Vector3, parentObject?: THREE.Object3D) => {
    if (!onSnapPointAdded) return;
    
    let parentId: string | undefined = undefined;
    let localPosition: THREE.Vector3 | undefined = undefined;
    let localNormal: THREE.Vector3 | undefined = undefined;
    
    if (parentObject && parentObject.userData?.componentId) {
      parentId = parentObject.userData.componentId;
      
      const invMatrix = new THREE.Matrix4().copy(parentObject.matrixWorld).invert();
      localPosition = position.clone().applyMatrix4(invMatrix);
      
      if (normal) {
        const invNormalMatrix = new THREE.Matrix3().getNormalMatrix(invMatrix);
        localNormal = normal.clone().applyMatrix3(invNormalMatrix).normalize();
      }
      
      console.log(`Attached snap point to parent: ${parentId}`);
      console.log(`Local position: ${localPosition.x.toFixed(3)}, ${localPosition.y.toFixed(3)}, ${localPosition.z.toFixed(3)}`);
    }
    
    const newSnapPoint: SnapPoint = {
      id: '', // Will be set by parent component
      name: 'New Snap Point',
      type: normal ? 'plane' : 'point',
      position: position,
      compatibility: [],
      parentId,
      localPosition,
    };
    
    if (normal) {
      newSnapPoint.normal = normal;
    }
    
    if (localNormal) {
      newSnapPoint.localNormal = localNormal;
    }
    
    onSnapPointAdded(newSnapPoint);
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 5, 5]} />
      <OrbitControls 
        makeDefault 
        enabled={!isSnapPointMode}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={directionalLightRef}
        position={[5, 10, 7.5]}
        intensity={1}
        castShadow
      />
      
      <gridHelper args={[10, 10]} position={[0, -0.01, 0]} />
      
      {placedObjects.map((object) => (
        <PlacedObject
          key={object.id}
          id={object.id}
          component={object.component}
          position={object.position}
          onSelect={onSelectObject}
          isSelected={selectedObjectId === object.id}
          isSnapPointMode={isSnapPointMode}
        />
      ))}
      
      <SnapPointEditor
        isActive={isSnapPointMode}
        snapPoints={snapPoints}
        onAddSnapPoint={handleSnapPointAdded}
        selectedSnapPointId={selectedSnapPointId}
        onSelectSnapPoint={onSelectSnapPoint}
      />
      
      {!isSnapPointMode && (
        <mesh onClick={handleClick} visible={false}>
          <boxGeometry args={[50, 50, 50]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}
    </>
  );
};

interface ViewportProps {
  selectedComponent: ComponentItem | null;
  onComponentPlaced: () => void;
  snapPoints?: SnapPoint[];
  setSnapPoints?: (snapPoints: SnapPoint[]) => void;
  isSnapPointMode?: boolean;
  onSnapPointAdded?: (snapPoint: SnapPoint) => void;
  selectedSnapPointId?: string | null;
  onSelectSnapPoint?: (id: string | null) => void;
}

export const Viewport: React.FC<ViewportProps> = ({ 
  selectedComponent, 
  onComponentPlaced,
  snapPoints = [],
  setSnapPoints = () => {},
  isSnapPointMode = false,
  onSnapPointAdded = () => {},
  selectedSnapPointId = null,
  onSelectSnapPoint = () => {}
}) => {
  const [placedObjects, setPlacedObjects] = useState<Array<{
    id: string;
    component: ComponentItem;
    position: [number, number, number];
  }>>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [hasLoadedModel, setHasLoadedModel] = useState(false);
  const location = useLocation();
  const isEditPage = location.pathname === '/edit';
  const isSupplierParameters = location.pathname === '/supplier/parameters';
  const isDesignPage = location.pathname === '/design';
  const [showStepViewer, setShowStepViewer] = useState(false);
  const [selectedStepComponent, setSelectedStepComponent] = useState<ComponentItem | null>(null);
  
  useEffect(() => {
    if (selectedComponent?.type === 'STEP' || selectedComponent?.type === 'STP') {
      setSelectedStepComponent(selectedComponent);
      setShowStepViewer(true);
    } else if (selectedComponent) {
      setShowStepViewer(false);
      setSelectedStepComponent(null);
    }
  }, [selectedComponent]);
  
  useEffect(() => {
    if (selectedComponent) {
      console.log('Viewport: Selected component changed:', selectedComponent);
      setHasLoadedModel(false);
    }
  }, [selectedComponent]);
  
  useEffect(() => {
    if ((isSupplierParameters || isDesignPage) && selectedComponent && !hasLoadedModel) {
      console.log("Loading product model:", selectedComponent);
      
      setPlacedObjects([]);
      
      setPlacedObjects([
        { 
          id: `model-${Date.now()}`, 
          component: selectedComponent, 
          position: [0, 0, 0] 
        }
      ]);
      
      setHasLoadedModel(true);
      
    } else if (!hasLoadedModel) {
      try {
        const shimanoModel: ComponentItem = {
          id: 'shimano-ep800',
          name: 'Shimano EP800',
          type: 'STL',
          thumbnail: '/placeholder.svg',
          folder: 'Default Models',
          modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models/1742796907092_Shimano_Ep800.stl',
          modelType: 'STL',
          shape: 'box'
        };
        
        const componentToPlace = selectedComponent || shimanoModel;
        
        console.log("Placing component:", componentToPlace);
        
        setPlacedObjects([
          { 
            id: `model-${Date.now()}`, 
            component: componentToPlace, 
            position: [0, 0, 0] 
          }
        ]);
        
        setHasLoadedModel(true);
        
        if (!isSupplierParameters && !isDesignPage && !selectedComponent) {
          const boxComponent: ComponentItem = {
            id: 'sample-box',
            name: 'Sample Box',
            type: 'box',
            thumbnail: '/placeholder.svg',
            folder: 'Sample Components',
            shape: 'box',
          };
          
          setPlacedObjects(prev => [
            ...prev,
            { 
              id: `box-${Date.now()}`, 
              component: boxComponent, 
              position: [1.5, 0, 0] 
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading default models:', error);
      }
    }
  }, [hasLoadedModel, selectedComponent, isSupplierParameters, isDesignPage]);
  
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
      
      onComponentPlaced();
      console.log(`Added ${selectedComponent.name} at position (${position.join(', ')})`);
    }
  };

  const handleSelectObject = (id: string) => {
    setSelectedObjectId(id === selectedObjectId ? null : id);
    const selected = placedObjects.find(obj => obj.id === id);
    if (selected) {
      console.log(`Selected object: ${selected.component.name} (${id})`);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedObjectId) {
      const selectedObject = placedObjects.find(obj => obj.id === selectedObjectId);
      setPlacedObjects(placedObjects.filter(obj => obj.id !== selectedObjectId));
      setSelectedObjectId(null);
      if (selectedObject) {
        console.log(`Deleted object: ${selectedObject.component.name} (${selectedObjectId})`);
      }
    }
  };

  const handleFitToView = () => {
    console.log("Fit to view action requested");
  };

  const handleSnapPointAdded = (snapPoint: SnapPoint) => {
    if (onSnapPointAdded) {
      onSnapPointAdded(snapPoint);
    }
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden rounded-2xl">
      {showStepViewer && selectedStepComponent && (
        <StepFileViewer 
          component={selectedStepComponent} 
          onClose={() => setShowStepViewer(false)} 
        />
      )}
      
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm"
          onClick={handleFitToView}
        >
          <Maximize size={16} />
          <span>Fit to View</span>
        </Button>
      </div>
      
      {selectedObjectId && !isSnapPointMode && (
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
      
      {isSnapPointMode && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm flex items-center gap-1.5 font-medium">
            <Crosshair size={18} className="animate-pulse" />
            <span>Click on model to add snap point</span>
          </div>
        </div>
      )}
      
      <Canvas shadows className="w-full h-full outline-none">
        <Scene 
          placedObjects={placedObjects}
          onSelectObject={handleSelectObject}
          selectedObjectId={selectedObjectId}
          onPlaceObject={handlePlaceObject}
          snapPoints={snapPoints}
          isSnapPointMode={isSnapPointMode}
          onSnapPointAdded={handleSnapPointAdded}
          selectedSnapPointId={selectedSnapPointId}
          onSelectSnapPoint={onSelectSnapPoint}
        />
      </Canvas>
    </div>
  );
};
