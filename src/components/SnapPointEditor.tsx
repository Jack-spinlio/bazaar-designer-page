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

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!isActive) return;
    
    event.stopPropagation();
    
    if (event.intersections.length > 0) {
      const intersection = event.intersections[0];
      const position = intersection.point.clone();
      const normal = intersection.face?.normal.clone();
      
      // Transform normal from local space to world space if it exists
      if (normal && intersection.object.type === 'Mesh') {
        const mesh = intersection.object as THREE.Mesh;
        normal.transformDirection(mesh.matrixWorld);
      }
      
      onAddSnapPoint(position, normal || undefined);
      toast.success('Snap point added');
    }
  };

  const handleMove = (event: ThreeEvent<MouseEvent>) => {
    if (!isActive) {
      setHoverPoint(null);
      setHoverNormal(null);
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
    }
  }, [isActive]);

  return (
    <group>
      {/* Hover indicator */}
      {isActive && hoverPoint && (
        <group position={hoverPoint}>
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.7} />
          </mesh>
          
          {hoverNormal && (
            <group>
              <Plane 
                args={[0.2, 0.2]} 
                rotation={[0, 0, 0]} 
                position={[0, 0, 0]}
                onPointerMove={(e) => e.stopPropagation()}
              >
                <meshBasicMaterial color="#0ea5e9" transparent opacity={0.5} side={THREE.DoubleSide} />
              </Plane>
              <arrowHelper 
                args={[
                  hoverNormal, 
                  new THREE.Vector3(0, 0, 0), 
                  0.2, 
                  0x0ea5e9
                ]} 
              />
            </group>
          )}
          
          <Html distanceFactor={10}>
            <div className="bg-black/75 text-white px-2 py-1 text-xs rounded whitespace-nowrap">
              Click to add snap point
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
                <arrowHelper 
                  args={[
                    snapPoint.normal, 
                    new THREE.Vector3(0, 0, 0), 
                    0.2, 
                    selectedSnapPointId === snapPoint.id ? 0xf97316 : 0x0ea5e9
                  ]} 
                />
              )}
            </group>
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
