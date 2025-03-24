
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

export interface SnapPoint {
  id: string;
  name: string;
  type: 'point' | 'plane';
  position: THREE.Vector3;
  normal?: THREE.Vector3;
  compatibility: string[];
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
  const [hoverPoint, setHoverPoint] = useState<string | null>(null);

  const handleClick = (e: any) => {
    if (!isActive) return;
    
    e.stopPropagation();
    
    // Use raycaster to get intersection with meshes in the scene
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      const intersection = intersects[0];
      const position = intersection.point.clone();
      
      // Get the normal at the intersection point if available
      let normal = intersection.face?.normal?.clone();
      
      // Apply the object's transformation to the normal if needed
      if (normal && intersection.object.parent) {
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(intersection.object.matrixWorld);
        normal.applyMatrix3(normalMatrix).normalize();
      }
      
      // Get the clicked object and check if it's a component
      const clickedObject = intersection.object;
      let parentObject = null;
      
      // Find parent object with componentId (traverse up the hierarchy)
      let current = clickedObject;
      while (current) {
        if (current.userData && current.userData.componentId) {
          parentObject = current;
          break;
        }
        if (!current.parent) break;
        current = current.parent;
      }

      // Add a small offset in the normal direction to avoid z-fighting
      if (normal) {
        position.add(normal.multiplyScalar(0.01));
      }
      
      console.log("Placing snap point at:", position.toArray());
      console.log("Object clicked:", clickedObject.type);
      console.log("Parent object:", parentObject ? parentObject.userData.componentName : "null");
      
      onAddSnapPoint(position, normal, parentObject);
    }
  };

  return (
    <group onClick={handleClick}>
      {isActive && snapPoints.map((point) => (
        <group key={point.id} position={point.position}>
          {/* Point visualization */}
          <mesh
            scale={selectedSnapPointId === point.id ? 0.12 : 0.08}
            onClick={(e) => {
              e.stopPropagation();
              onSelectSnapPoint(point.id);
            }}
            onPointerOver={() => setHoverPoint(point.id)}
            onPointerOut={() => setHoverPoint(null)}
          >
            <sphereGeometry />
            <meshStandardMaterial
              color={selectedSnapPointId === point.id ? '#ff3d00' : (hoverPoint === point.id ? '#ffab00' : '#3d5afe')}
              emissive={selectedSnapPointId === point.id ? '#ff3d00' : (hoverPoint === point.id ? '#ffab00' : '#3d5afe')}
              emissiveIntensity={0.5}
            />
          </mesh>
          
          {/* Normal direction visualization (if normal exists) */}
          {point.normal && point.type === 'plane' && (
            <group>
              <mesh position={point.normal.clone().multiplyScalar(0.15)}>
                <cylinderGeometry args={[0.015, 0.015, 0.3]} />
                <meshStandardMaterial color="#00e676" />
              </mesh>
              <mesh 
                position={point.normal.clone().multiplyScalar(0.3)}
                rotation={[Math.PI/2, 0, 0]}
              >
                <coneGeometry args={[0.05, 0.1]} />
                <meshStandardMaterial color="#00e676" />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
};
