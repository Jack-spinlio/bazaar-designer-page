
import React, { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Plane, Html } from '@react-three/drei';
import * as THREE from 'three';
import { toast } from 'sonner';
import { Crosshair } from 'lucide-react';

export interface SnapPoint {
  id: string;
  name: string;
  type: 'point' | 'plane';
  position: THREE.Vector3;
  normal?: THREE.Vector3;
  compatibility: string[];
  // New properties to track parent mesh and local position
  parentId?: string;
  localPosition?: THREE.Vector3;
  localNormal?: THREE.Vector3;
}

interface SnapPointEditorProps {
  isActive: boolean;
  snapPoints: SnapPoint[];
  onAddSnapPoint: (position: THREE.Vector3, normal?: THREE.Vector3, parentObject?: THREE.Object3D) => void;
  selectedSnapPointId: string | null;
  onSelectSnapPoint: (id: string | null) => void;
}

export const SnapPointEditor: React.FC<SnapPointEditorProps> = ({
  isActive,
  snapPoints,
  onAddSnapPoint,
  selectedSnapPointId,
  onSelectSnapPoint
}) => {
  const { raycaster, camera, scene } = useThree();
  const [hoverPoint, setHoverPoint] = useState<THREE.Vector3 | null>(null);
  const [hoverNormal, setHoverNormal] = useState<THREE.Vector3 | null>(null);
  const [hoverObject, setHoverObject] = useState<THREE.Object3D | null>(null);
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false);
  const [pendingPosition, setPendingPosition] = useState<THREE.Vector3 | null>(null);
  const [pendingNormal, setPendingNormal] = useState<THREE.Vector3 | null>(null);
  const [pendingObject, setPendingObject] = useState<THREE.Object3D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const handlePointerMove = (event: MouseEvent) => {
      if (!isActive || isPendingConfirmation) return;

      const canvasElement = document.querySelector('canvas');
      if (!canvasElement) return;
      
      const rect = canvasElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const intersection = intersects[0];
        setHoverPoint(intersection.point.clone());
        
        // Find the top-level mesh parent
        let currentObject: THREE.Object3D | null = intersection.object;
        let topParent: THREE.Object3D | null = null;
        
        // Traverse up the hierarchy to find a mesh with componentId in userData
        while (currentObject) {
          if (currentObject.userData && 
              (currentObject.userData.componentId || 
               currentObject.userData.isComponent)) {
            topParent = currentObject;
            break;
          }
          currentObject = currentObject.parent;
        }
        
        setHoverObject(topParent);
        
        if (intersection.face?.normal) {
          const normal = intersection.face.normal.clone();
          
          if (intersection.object.type === 'Mesh') {
            const mesh = intersection.object as THREE.Mesh;
            normal.transformDirection(mesh.matrixWorld);
          }
          
          setHoverNormal(normal);
        } else {
          setHoverNormal(null);
        }
      } else {
        setHoverPoint(null);
        setHoverNormal(null);
        setHoverObject(null);
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (!isActive || isPendingConfirmation) return;
      
      const canvasElement = document.querySelector('canvas');
      if (!canvasElement) return;
      
      const rect = canvasElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      const intersects = raycaster.intersectObjects(scene.children, true);
      console.log("Pointer down intersects:", intersects);
      
      if (intersects.length > 0) {
        const intersection = intersects[0];
        
        // Check if we're clicking on an existing snap point
        let isSnapPointClick = false;
        let snapPointId: string | null = null;
        
        // Traverse up the object hierarchy to check for userData
        let currentObject: THREE.Object3D | null = intersection.object;
        while (currentObject && !isSnapPointClick) {
          if (currentObject.userData && currentObject.userData.isSnapPoint) {
            isSnapPointClick = true;
            snapPointId = currentObject.userData.id || null;
            break;
          }
          currentObject = currentObject.parent;
        }
        
        if (isSnapPointClick && snapPointId) {
          console.log("Clicked on snap point:", snapPointId);
          onSelectSnapPoint(snapPointId === selectedSnapPointId ? null : snapPointId);
          return; // Don't place a new snap point
        }
        
        // Find the parent mesh/component object
        let parentObject: THREE.Object3D | null = intersection.object;
        let foundParent = false;
        
        while (parentObject && !foundParent) {
          if (parentObject.userData && 
              (parentObject.userData.componentId || 
               parentObject.userData.isComponent)) {
            foundParent = true;
            break;
          }
          parentObject = parentObject.parent;
        }
        
        if (!foundParent) {
          parentObject = null;
        }
        
        // Not a snap point click, so place a new one
        const position = intersection.point.clone();
        let normal = null;
        
        if (intersection.face?.normal) {
          normal = intersection.face.normal.clone();
          
          if (intersection.object.type === 'Mesh') {
            const mesh = intersection.object as THREE.Mesh;
            normal.transformDirection(mesh.matrixWorld);
          }
        }
        
        setPendingPosition(position);
        setPendingNormal(normal);
        setPendingObject(parentObject);
        setIsPendingConfirmation(true);
        
        console.log("Placing snap point at:", position);
        console.log("Object clicked:", intersection.object.type);
        console.log("Object name:", intersection.object.name);
        console.log("Object userData:", intersection.object.userData);
        console.log("Parent object:", parentObject);
        if (normal) console.log("Normal:", normal);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isActive, isPendingConfirmation, raycaster, camera, scene, onSelectSnapPoint, selectedSnapPointId]);

  const handleConfirmSnapPoint = () => {
    if (pendingPosition) {
      let localPosition: THREE.Vector3 | undefined;
      let localNormal: THREE.Vector3 | undefined;
      
      // Calculate local position and normal if we have a parent object
      if (pendingObject) {
        // Ensure parent's matrix is up to date
        pendingObject.updateMatrixWorld(true);
        
        // Convert world position to local position
        const worldPos = pendingPosition.clone();
        const invMatrix = new THREE.Matrix4().copy(pendingObject.matrixWorld).invert();
        localPosition = worldPos.clone().applyMatrix4(invMatrix);
        
        // Convert world normal to local normal
        if (pendingNormal) {
          const invNormalMatrix = new THREE.Matrix3().getNormalMatrix(invMatrix);
          localNormal = pendingNormal.clone().applyMatrix3(invNormalMatrix).normalize();
        }
        
        console.log("Local position:", localPosition);
        if (localNormal) console.log("Local normal:", localNormal);
      }
      
      onAddSnapPoint(pendingPosition, pendingNormal || undefined, pendingObject || undefined);
      setIsPendingConfirmation(false);
      setPendingPosition(null);
      setPendingNormal(null);
      setPendingObject(null);
      toast.success('Snap point added');
    }
  };

  const handleCancelSnapPoint = () => {
    setIsPendingConfirmation(false);
    setPendingPosition(null);
    setPendingNormal(null);
    setPendingObject(null);
  };

  const formatCoordinates = (vector: THREE.Vector3): string => {
    return `X: ${vector.x.toFixed(2)}, Y: ${vector.y.toFixed(2)}, Z: ${vector.z.toFixed(2)}`;
  };

  return (
    <group>
      {isActive && !isPendingConfirmation && (
        <Html 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none', 
            zIndex: 10 
          }}
        >
          {hoverPoint && (
            <div 
              style={{ 
                position: 'absolute', 
                left: '50%', 
                top: '50%', 
                transform: 'translate(-50%, -50%)',
                color: '#F97316', // Bright Orange crosshair
                opacity: 0.7 
              }}
            >
              <Crosshair size={32} strokeWidth={1.5} />
            </div>
          )}
        </Html>
      )}
      {isActive && !isPendingConfirmation && hoverPoint && (
        <group position={hoverPoint}>
          <mesh>
            <sphereGeometry args={[0.12, 24, 24]} />
            <meshBasicMaterial color={hoverObject ? "#22c55e" : "#f97316"} transparent opacity={0.7} />
          </mesh>
          
          {hoverNormal && (
            <group>
              <Plane 
                args={[0.2, 0.2]} 
                rotation={[0, 0, 0]} 
                position={[0, 0, 0]}
              >
                <meshBasicMaterial color={hoverObject ? "#22c55e" : "#f97316"} transparent opacity={0.5} side={THREE.DoubleSide} />
              </Plane>
              <primitive 
                object={new THREE.ArrowHelper(
                  hoverNormal.clone().normalize(),
                  new THREE.Vector3(0, 0, 0),
                  0.3,
                  hoverObject ? 0x22c55e : 0xf97316,
                  0.07,
                  0.07
                )} 
              />
            </group>
          )}
          
          <Html distanceFactor={10}>
            <div className="bg-black/90 text-white px-3 py-2 text-sm rounded-lg whitespace-nowrap shadow-lg flex flex-col">
              <div className="font-medium">{hoverObject ? "Click to place snap point on mesh" : "No mesh detected"}</div>
              <div className="text-xs opacity-80">{formatCoordinates(hoverPoint)}</div>
              {hoverObject && <div className="text-xs opacity-80">Parent: {hoverObject.name || hoverObject.uuid.substring(0, 8)}</div>}
            </div>
          </Html>
        </group>
      )}
      
      {isActive && isPendingConfirmation && pendingPosition && (
        <group position={pendingPosition}>
          <mesh>
            <sphereGeometry args={[0.15, 24, 24]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.8} />
          </mesh>
          
          {pendingNormal && (
            <group>
              <Plane 
                args={[0.25, 0.25]} 
                rotation={[0, 0, 0]} 
                position={[0, 0, 0]}
              >
                <meshBasicMaterial color="#f97316" transparent opacity={0.6} side={THREE.DoubleSide} />
              </Plane>
              <primitive 
                object={new THREE.ArrowHelper(
                  pendingNormal.clone().normalize(),
                  new THREE.Vector3(0, 0, 0),
                  0.35,
                  0xf97316,
                  0.08,
                  0.08
                )}
              />
            </group>
          )}
          
          <Html distanceFactor={10}>
            <div className="flex flex-col items-center bg-black/90 text-white px-4 py-3 rounded-lg whitespace-nowrap shadow-lg">
              <div className="text-sm font-semibold mb-1">Confirm snap point placement</div>
              <div className="text-xs opacity-80 mb-2">{formatCoordinates(pendingPosition)}</div>
              {pendingObject && (
                <div className="text-xs opacity-80 mb-2">
                  Will be attached to: {pendingObject.name || pendingObject.uuid.substring(0, 8)}
                </div>
              )}
              <div className="flex space-x-2">
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-md font-medium"
                  onClick={handleConfirmSnapPoint}
                >
                  Confirm
                </button>
                <button 
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md font-medium"
                  onClick={handleCancelSnapPoint}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Html>
        </group>
      )}
      
      {snapPoints.map((snapPoint) => (
        <group 
          key={snapPoint.id} 
          position={[snapPoint.position.x, snapPoint.position.y, snapPoint.position.z]}
          userData={{ isSnapPoint: true, id: snapPoint.id }}
        >
          {snapPoint.type === 'point' ? (
            <mesh userData={{ isSnapPoint: true, id: snapPoint.id }}>
              <sphereGeometry args={[0.15, 24, 24]} />
              <meshBasicMaterial 
                color={selectedSnapPointId === snapPoint.id ? "#f97316" : "#0ea5e9"} 
                transparent 
                opacity={0.8} 
              />
            </mesh>
          ) : (
            <group userData={{ isSnapPoint: true, id: snapPoint.id }}>
              <Plane args={[0.25, 0.25]}>
                <meshBasicMaterial 
                  color={selectedSnapPointId === snapPoint.id ? "#f97316" : "#0ea5e9"} 
                  transparent 
                  opacity={0.6} 
                  side={THREE.DoubleSide} 
                />
              </Plane>
              
              {snapPoint.normal && (
                <primitive 
                  object={new THREE.ArrowHelper(
                    snapPoint.normal.clone().normalize(),
                    new THREE.Vector3(0, 0, 0),
                    0.3,
                    selectedSnapPointId === snapPoint.id ? 0xf97316 : 0x0ea5e9,
                    0.06,
                    0.06
                  )} 
                />
              )}
            </group>
          )}
          
          {selectedSnapPointId === snapPoint.id && (
            <mesh userData={{ isSnapPoint: true, id: snapPoint.id }}>
              <boxGeometry args={[0.35, 0.35, 0.35]} />
              <meshBasicMaterial color="#FF5733" wireframe={true} wireframeLinewidth={2} />
            </mesh>
          )}
          
          <Html distanceFactor={10}>
            <div 
              className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap shadow-lg ${
                selectedSnapPointId === snapPoint.id 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}
            >
              <div className="font-medium">{snapPoint.name}</div>
              <div className="text-xs opacity-90 mt-0.5">{formatCoordinates(snapPoint.position)}</div>
              {snapPoint.parentId && (
                <div className="text-xs opacity-90 mt-0.5">Attached to: {snapPoint.parentId}</div>
              )}
              {snapPoint.localPosition && (
                <div className="text-xs opacity-90 mt-0.5">
                  Local: {formatCoordinates(snapPoint.localPosition)}
                </div>
              )}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};
