
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

  return (
    <group>
      {/* Hover indicator */}
      {isActive && !isPendingConfirmation && hoverPoint && (
        <group position={hoverPoint}>
          <mesh>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.7} />
          </mesh>
          
          {hoverNormal && (
            <group>
              <Plane 
                args={[0.1, 0.1]} 
                rotation={[0, 0, 0]} 
                position={[0, 0, 0]}
                onPointerMove={(e) => e.stopPropagation()}
              >
                <meshBasicMaterial color="#22c55e" transparent opacity={0.5} side={THREE.DoubleSide} />
              </Plane>
              <arrowHelper 
                args={[
                  hoverNormal, 
                  new THREE.Vector3(0, 0, 0), 
                  0.15, 
                  0x22c55e
                ]} 
              />
            </group>
          )}
          
          <Html distanceFactor={10}>
            <div className="bg-black/75 text-white px-2 py-1 text-xs rounded whitespace-nowrap">
              Click to place snap point
            </div>
          </Html>
        </group>
      )}
      
      {/* Pending confirmation indicator */}
      {isActive && isPendingConfirmation && pendingPosition && (
        <group position={pendingPosition}>
          <mesh>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.8} />
          </mesh>
          
          {pendingNormal && (
            <group>
              <Plane 
                args={[0.15, 0.15]} 
                rotation={[0, 0, 0]} 
                position={[0, 0, 0]}
                onPointerMove={(e) => e.stopPropagation()}
              >
                <meshBasicMaterial color="#f97316" transparent opacity={0.6} side={THREE.DoubleSide} />
              </Plane>
              <arrowHelper 
                args={[
                  pendingNormal, 
                  new THREE.Vector3(0, 0, 0), 
                  0.2, 
                  0xf97316
                ]} 
              />
            </group>
          )}
          
          <Html distanceFactor={10}>
            <div className="flex flex-col items-center bg-black/75 text-white px-3 py-2 rounded whitespace-nowrap">
              <div className="text-xs font-semibold mb-2">Confirm snap point placement?</div>
              <div className="flex space-x-2">
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                  onClick={handleConfirmSnapPoint}
                >
                  Confirm
                </button>
                <button 
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
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
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial 
                color={selectedSnapPointId === snapPoint.id ? "#f97316" : "#0ea5e9"} 
                transparent 
                opacity={0.8} 
              />
            </mesh>
          ) : (
            <group>
              <Plane args={[0.15, 0.15]}>
                <meshBasicMaterial 
                  color={selectedSnapPointId === snapPoint.id ? "#f97316" : "#0ea5e9"} 
                  transparent 
                  opacity={0.6} 
                  side={THREE.DoubleSide} 
                />
              </Plane>
              
              {snapPoint.normal && (
                <arrowHelper 
                  args={[
                    snapPoint.normal, 
                    new THREE.Vector3(0, 0, 0), 
                    0.15, 
                    selectedSnapPointId === snapPoint.id ? 0xf97316 : 0x0ea5e9
                  ]} 
                />
              )}
            </group>
          )}
          
          {/* Selection indicator */}
          {selectedSnapPointId === snapPoint.id && (
            <mesh>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshBasicMaterial color="#f97316" wireframe={true} />
            </mesh>
          )}
          
          <Html distanceFactor={10}>
            <div 
              className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                selectedSnapPointId === snapPoint.id 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}
            >
              {snapPoint.name}
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
