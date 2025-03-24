
import React, { useEffect, useState } from 'react';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { Plane, Html } from '@react-three/drei';
import * as THREE from 'three';
import { toast } from 'sonner';

export interface SnapPoint {
  id: string;
  name: string;
  type: 'point' | 'plane';
  position: THREE.Vector3;
  normal?: THREE.Vector3;
  compatibility: string[];
}

interface SnapPointEditorProps {
  isActive: boolean;
  snapPoints: SnapPoint[];
  onAddSnapPoint: (position: THREE.Vector3, normal?: THREE.Vector3) => void;
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
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false);
  const [pendingPosition, setPendingPosition] = useState<THREE.Vector3 | null>(null);
  const [pendingNormal, setPendingNormal] = useState<THREE.Vector3 | null>(null);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!isActive) return;
    
    event.stopPropagation();
    
    if (isPendingConfirmation) {
      // User clicked while in confirmation mode - cancel the pending point
      setIsPendingConfirmation(false);
      setPendingPosition(null);
      setPendingNormal(null);
      return;
    }
    
    if (event.intersections.length > 0) {
      const intersection = event.intersections[0];
      const position = intersection.point.clone();
      const normal = intersection.face?.normal.clone();
      
      // Transform normal from local space to world space if it exists
      if (normal && intersection.object.type === 'Mesh') {
        const mesh = intersection.object as THREE.Mesh;
        normal.transformDirection(mesh.matrixWorld);
      }
      
      // Set pending position and normal for confirmation
      setPendingPosition(position);
      setPendingNormal(normal || null);
      setIsPendingConfirmation(true);
    }
  };

  const handleConfirmSnapPoint = () => {
    if (pendingPosition) {
      onAddSnapPoint(pendingPosition, pendingNormal || undefined);
      setIsPendingConfirmation(false);
      setPendingPosition(null);
      setPendingNormal(null);
      toast.success('Snap point added');
    }
  };

  const handleCancelSnapPoint = () => {
    setIsPendingConfirmation(false);
    setPendingPosition(null);
    setPendingNormal(null);
  };

  const handleMove = (event: ThreeEvent<MouseEvent>) => {
    if (!isActive || isPendingConfirmation) {
      if (!isPendingConfirmation) {
        setHoverPoint(null);
        setHoverNormal(null);
      }
      return;
    }
    
    if (event.intersections.length > 0) {
      const intersection = event.intersections[0];
      setHoverPoint(intersection.point.clone());
      
      if (intersection.face?.normal) {
        const normal = intersection.face.normal.clone();
        
        // Transform normal from local space to world space
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
    }
  };

  // Clean up hover state when editor becomes inactive
  useEffect(() => {
    if (!isActive) {
      setHoverPoint(null);
      setHoverNormal(null);
      setIsPendingConfirmation(false);
      setPendingPosition(null);
      setPendingNormal(null);
    }
  }, [isActive]);

  // Format coordinates to a readable string
  const formatCoordinates = (vector: THREE.Vector3): string => {
    return `X: ${vector.x.toFixed(2)}, Y: ${vector.y.toFixed(2)}, Z: ${vector.z.toFixed(2)}`;
  };

  // Fix: Create arrow helper manually instead of using the JSX element
  const createArrowHelper = (direction: THREE.Vector3, origin: THREE.Vector3, length: number, color: number, headLength?: number, headWidth?: number) => {
    const arrowHelper = new THREE.ArrowHelper(
      direction.clone().normalize(),
      origin,
      length,
      color,
      headLength,
      headWidth
    );
    return arrowHelper;
  };

  return (
    <group>
      {/* Hover indicator */}
      {isActive && !isPendingConfirmation && hoverPoint && (
        <group position={hoverPoint}>
          {/* Larger indicator sphere */}
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.7} />
          </mesh>
          
          {hoverNormal && (
            <group>
              <Plane 
                args={[0.15, 0.15]} 
                rotation={[0, 0, 0]} 
                position={[0, 0, 0]}
                onPointerMove={(e) => e.stopPropagation()}
              >
                <meshBasicMaterial color="#22c55e" transparent opacity={0.5} side={THREE.DoubleSide} />
              </Plane>
              <primitive object={createArrowHelper(
                hoverNormal,
                new THREE.Vector3(0, 0, 0),
                0.25,
                0x22c55e,
                0.05,
                0.05
              )} />
            </group>
          )}
          
          <Html distanceFactor={10}>
            <div className="bg-black/90 text-white px-3 py-2 text-sm rounded-lg whitespace-nowrap shadow-lg flex flex-col">
              <div className="font-medium">Click to place snap point</div>
              <div className="text-xs opacity-80">{formatCoordinates(hoverPoint)}</div>
            </div>
          </Html>
        </group>
      )}
      
      {/* Pending confirmation indicator */}
      {isActive && isPendingConfirmation && pendingPosition && (
        <group position={pendingPosition}>
          {/* Larger indicator sphere */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.8} />
          </mesh>
          
          {pendingNormal && (
            <group>
              <Plane 
                args={[0.2, 0.2]} 
                rotation={[0, 0, 0]} 
                position={[0, 0, 0]}
                onPointerMove={(e) => e.stopPropagation()}
              >
                <meshBasicMaterial color="#f97316" transparent opacity={0.6} side={THREE.DoubleSide} />
              </Plane>
              <primitive object={createArrowHelper(
                pendingNormal,
                new THREE.Vector3(0, 0, 0),
                0.3,
                0xf97316,
                0.06,
                0.06
              )} />
            </group>
          )}
          
          <Html distanceFactor={10}>
            <div className="flex flex-col items-center bg-black/90 text-white px-4 py-3 rounded-lg whitespace-nowrap shadow-lg">
              <div className="text-sm font-semibold mb-1">Confirm snap point placement</div>
              <div className="text-xs opacity-80 mb-2">{formatCoordinates(pendingPosition)}</div>
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
      
      {/* Existing snap points */}
      {snapPoints.map((snapPoint) => (
        <group 
          key={snapPoint.id} 
          position={[snapPoint.position.x, snapPoint.position.y, snapPoint.position.z]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectSnapPoint(snapPoint.id === selectedSnapPointId ? null : snapPoint.id);
          }}
        >
          {snapPoint.type === 'point' ? (
            <mesh>
              {/* Larger existing point */}
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial 
                color={selectedSnapPointId === snapPoint.id ? "#f97316" : "#0ea5e9"} 
                transparent 
                opacity={0.8} 
              />
            </mesh>
          ) : (
            <group>
              <Plane args={[0.2, 0.2]}>
                <meshBasicMaterial 
                  color={selectedSnapPointId === snapPoint.id ? "#f97316" : "#0ea5e9"} 
                  transparent 
                  opacity={0.6} 
                  side={THREE.DoubleSide} 
                />
              </Plane>
              
              {snapPoint.normal && (
                <primitive object={createArrowHelper(
                  snapPoint.normal,
                  new THREE.Vector3(0, 0, 0),
                  0.25,
                  selectedSnapPointId === snapPoint.id ? 0xf97316 : 0x0ea5e9,
                  0.05,
                  0.05
                )} />
              )}
            </group>
          )}
          
          {/* Selection indicator - using bright colors and wireframe */}
          {selectedSnapPointId === snapPoint.id && (
            <mesh>
              <boxGeometry args={[0.25, 0.25, 0.25]} />
              <meshBasicMaterial color="#FF5733" wireframe={true} wireframeLinewidth={2} />
            </mesh>
          )}
          
          <Html distanceFactor={10}>
            <div 
              className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap shadow-lg ${
                selectedSnapPointId === snapPoint.id 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}
            >
              <div>{snapPoint.name}</div>
              <div className="text-xs opacity-80 mt-0.5">{formatCoordinates(snapPoint.position)}</div>
            </div>
          </Html>
        </group>
      ))}
      
      {/* Invisible plane to capture clicks */}
      <mesh visible={false} onPointerMove={handleMove} onClick={handleClick}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};
