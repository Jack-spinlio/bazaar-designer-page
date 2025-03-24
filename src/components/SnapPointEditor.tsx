
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
    
    // Clean up on mode deactivation
    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }
    };
  }, [isActive]);

  // Find the closest intersection point on any mesh
  const findClosestMeshIntersection = (e: any): THREE.Intersection | null => {
    // Stop event propagation to prevent duplicate handling
    e.stopPropagation();
    
    // Use raycaster to get intersections with all meshes in the scene
    const intersections = raycaster.intersectObjects(
      scene.children.filter(obj => {
        // Filter out snap point visualizations and the click plane
        const isSnapPointViz = obj.userData && obj.userData.isSnapPointVisualization;
        const isClickPlane = obj.userData && obj.userData.isClickPlane;
        
        // Keep only legitimate scene objects
        return !isSnapPointViz && !isClickPlane;
      }), 
      true
    );
    
    // Return the closest intersection (first one)
    if (intersections.length > 0) {
      return intersections[0];
    }
    
    return null;
  };

  const handleClick = (e: any) => {
    // Guard conditions
    if (!isActive || isProcessingClick) return;
    
    // Prevent duplicate clicks by setting a processing flag
    setIsProcessingClick(true);
    
    // Find the closest mesh intersection
    const intersection = findClosestMeshIntersection(e);
    
    if (intersection) {
      // Get the exact intersection point on the mesh surface
      const position = intersection.point.clone();
      
      // Get the normal at the intersection point
      let normal = intersection.face?.normal ? intersection.face.normal.clone() : undefined;
      
      // Transform the normal from local object space to world space if needed
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
        // Move to parent in the object hierarchy
        current = current.parent;
      }
      
      // No offset needed now as we're using the exact intersection point
      console.log("Placing snap point at exact intersection:", position.toArray());
      console.log("Object clicked:", clickedObject.type);
      console.log("Parent object:", parentObject ? parentObject.userData.componentName : "null");
      console.log("Distance from camera:", camera.position.distanceTo(position));
      
      // Use the exact intersection point for the snap point
      onAddSnapPoint(position, normal, parentObject);
      
      // Reset processing flag after a short delay
      clickTimeout.current = setTimeout(() => {
        setIsProcessingClick(false);
      }, 300);
    } else {
      console.log("No mesh intersection found");
      setIsProcessingClick(false);
    }
  };

  // Create a transparent plane that only receives clicks for the snap point editor
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
          {/* Point visualization - smaller size for more precise positioning */}
          <mesh
            scale={selectedSnapPointId === point.id ? 0.08 : 0.05}
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
                position={point.normal.clone().multiplyScalar(0.12)}
                userData={{ isSnapPointVisualization: true }}
              >
                <cylinderGeometry args={[0.01, 0.01, 0.24]} />
                <meshStandardMaterial color="#00e676" />
              </mesh>
              <mesh 
                position={point.normal.clone().multiplyScalar(0.24)}
                rotation={[Math.PI/2, 0, 0]}
                userData={{ isSnapPointVisualization: true }}
              >
                <coneGeometry args={[0.03, 0.06]} />
                <meshStandardMaterial color="#00e676" />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
};
