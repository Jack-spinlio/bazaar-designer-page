
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Load an STL file from a URL and return a mesh
export const loadSTLModel = (
  url: string, 
  onLoad?: (mesh: THREE.Mesh) => void,
  onProgress?: (event: ProgressEvent) => void,
  onError?: (error: unknown) => void
): Promise<THREE.Mesh> => {
  return new Promise((resolve, reject) => {
    const loader = new STLLoader();
    
    loader.load(
      url,
      (geometry) => {
        // Create a material and a mesh
        const material = new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          metalness: 0.3,
          roughness: 0.4,
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        // Center the geometry
        geometry.computeBoundingBox();
        if (geometry.boundingBox) {
          const center = new THREE.Vector3();
          geometry.boundingBox.getCenter(center);
          geometry.translate(-center.x, -center.y, -center.z);
        }
        
        // Add a wireframe to make it more visible
        const wireframeMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true
        });
        const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
        mesh.add(wireframe);
        
        if (onLoad) onLoad(mesh);
        resolve(mesh);
      },
      onProgress,
      (error) => {
        console.error('Error loading STL:', error);
        if (onError) onError(error);
        reject(error);
      }
    );
  });
};

// Load an OBJ file from a URL and return a mesh
export const loadOBJModel = (
  url: string,
  onLoad?: (mesh: THREE.Group) => void,
  onProgress?: (event: ProgressEvent) => void,
  onError?: (error: unknown) => void
): Promise<THREE.Group> => {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    
    loader.load(
      url,
      (object) => {
        // Apply materials to all meshes in the OBJ
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x22c55e,
              metalness: 0.3,
              roughness: 0.4
            });
            
            // Add wireframe
            const wireframeMaterial = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              wireframe: true
            });
            const wireframe = new THREE.Mesh(child.geometry.clone(), wireframeMaterial);
            child.add(wireframe);
          }
        });
        
        if (onLoad) onLoad(object);
        resolve(object);
      },
      onProgress,
      (error) => {
        console.error('Error loading OBJ:', error);
        if (onError) onError(error);
        reject(error);
      }
    );
  });
};

// Generic function to load a model based on its extension
export const loadModel = async (
  url: string,
  fileType: string
): Promise<THREE.Object3D> => {
  try {
    const lowerType = fileType.toLowerCase();
    
    if (lowerType === 'stl') {
      return await loadSTLModel(url);
    } else if (lowerType === 'obj') {
      return await loadOBJModel(url);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Error loading model:', error);
    // Return a default cube as fallback
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    return new THREE.Mesh(geometry, material);
  }
};
