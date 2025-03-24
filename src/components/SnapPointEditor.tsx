
import React, { useRef, useState, useEffect } from 'react';
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
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isProcessingClick, setIsProcessingClick] = useState(false);

  // Reset processing state when active state changes
  useEffect(() => {
    setIsProcessingClick(false);
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
  }, [isActive]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }
    };
  }, []);

  const handleClick = (e: any) => {
    // Guard conditions
    if (!isActive || isProcessingClick) return;
    
    // Prevent duplicate clicks by setting a processing flag
    setIsProcessingClick(true);
    
    // Stop event propagation to prevent duplicate handling
    e.stopPropagation();
    
    // Use raycaster to get intersection with meshes in the scene
    // Skip the click handler mesh itself and any snap point visualization meshes
    const intersects = raycaster.intersectObjects(
      scene.children.filter(obj => {
        // Exclude our clickable plane and snap point visualizations
        const isSnapPointViz = obj.userData && obj.userData.isSnapPointVisualization;
        const isClickPlane = obj.userData && obj.userData.isClickPlane;
        return !isSnapPointViz && !isClickPlane;
      }), 
      true
    );
    
    if (intersects.length > 0) {
      const intersection = intersects[0];
      const position = intersection.point.clone();
      
      // Get the normal at the intersection point if available
      let normal = intersection.face?.normal ? intersection.face.normal.clone() : undefined;
      
      // Apply the object's transformation to the normal if needed
      if (normal && intersection.object.matrixWorld) {
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
        current = current.parent;
      }

      // Add a small offset in the normal direction to prevent z-fighting and make the point visible
      if (normal) {
        const offsetNormal = normal.clone();
        position.add(offsetNormal.multiplyScalar(0.02));
      }
      
      console.log("Placing snap point at:", position.toArray());
      console.log("Object clicked:", clickedObject.type);
      console.log("Parent object:", parentObject ? parentObject.userData.componentName : "null");
      
      // Only add snap point if we have a valid intersection
      onAddSnapPoint(position, normal, parentObject);
      
      // Reset processing flag after a short delay
      clickTimeout.current = setTimeout(() => {
        setIsProcessingClick(false);
      }, 300);
    } else {
      // Reset processing flag if no intersection
      setIsProcessingClick(false);
    }
  };

  // Create a transparent plane that only receives clicks for the snap point editor
  // and doesn't interfere with other scene interactions
  return (
    <group>
      {isActive && (
        <mesh 
          visible={false} 
          onClick={handleClick} 
          userData={{ isClickPlane: true }}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {snapPoints.map((point) => (
        <group 
          key={point.id} 
          position={point.position}
          userData={{ isSnapPointVisualization: true }}
        >
          {/* Point visualization */}
          <mesh
            scale={selectedSnapPointId === point.id ? 0.12 : 0.08}
            onClick={(e) => {
              e.stopPropagation();
              onSelectSnapPoint(point.id);
            }}
            onPointerOver={() => setHoverPoint(point.id)}
            onPointerOut={() => setHoverPoint(null)}
            userData={{ isSnapPointVisualization: true }}
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
            <group userData={{ isSnapPointVisualization: true }}>
              <mesh 
                position={point.normal.clone().multiplyScalar(0.15)}
                userData={{ isSnapPointVisualization: true }}
              >
                <cylinderGeometry args={[0.015, 0.015, 0.3]} />
                <meshStandardMaterial color="#00e676" />
              </mesh>
              <mesh 
                position={point.normal.clone().multiplyScalar(0.3)}
                rotation={[Math.PI/2, 0, 0]}
                userData={{ isSnapPointVisualization: true }}
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
