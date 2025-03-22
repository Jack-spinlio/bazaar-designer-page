
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
    console.log(`Starting to load STL model from URL: ${url}`);
    const loader = new STLLoader();
    
    loader.load(
      url,
      (geometry) => {
        console.log(`STL geometry loaded successfully from ${url}`);
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
        console.log('STL model loaded and processed successfully');
      },
      (progressEvent) => {
        console.log(`Loading progress: ${progressEvent.loaded} / ${progressEvent.total}`);
        if (onProgress) onProgress(progressEvent);
      },
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
    console.log(`Starting to load OBJ model from URL: ${url}`);
    const loader = new OBJLoader();
    
    loader.load(
      url,
      (object) => {
        console.log(`OBJ model loaded successfully from ${url}`);
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
        console.log('OBJ model processed successfully');
      },
      (progressEvent) => {
        console.log(`Loading progress: ${progressEvent.loaded} / ${progressEvent.total}`);
        if (onProgress) onProgress(progressEvent);
      },
      (error) => {
        console.error('Error loading OBJ:', error);
        if (onError) onError(error);
        reject(error);
      }
    );
  });
};

// Handle STP/STEP files - Since we don't have a direct Three.js loader for STP/STEP,
// we'll create a placeholder geometry for them
export const loadSTPModel = (
  url: string,
  onLoad?: (mesh: THREE.Object3D) => void,
  onProgress?: (event: ProgressEvent) => void,
  onError?: (error: unknown) => void
): Promise<THREE.Object3D> => {
  return new Promise((resolve) => {
    console.log(`Creating placeholder for STP/STEP model: ${url}`);
    
    // Create a group to hold our placeholder geometry
    const group = new THREE.Group();
    
    // Create a placeholder cube
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.5,
      roughness: 0.3
    });
    const cube = new THREE.Mesh(geometry, material);
    group.add(cube);
    
    // Add a text label indicating this is a placeholder for STP file
    const messageObj = new THREE.Group();
    messageObj.position.set(0, 0.5, 0);
    group.add(messageObj);
    
    if (onLoad) onLoad(group);
    
    toast.info(`STP/STEP file detected: ${url.split('/').pop()}`, {
      description: "STP/STEP visualization is simplified as a placeholder"
    });
    
    resolve(group);
  });
};

// Generic function to load a model based on its extension
export const loadModel = async (
  url: string,
  fileType: string
): Promise<THREE.Object3D> => {
  try {
    console.log(`Loading model from URL: ${url}, type: ${fileType}`);
    const lowerType = fileType.toLowerCase();
    
    if (lowerType === 'stl') {
      console.log('Using STL loader for', url);
      return await loadSTLModel(url);
    } else if (lowerType === 'obj') {
      console.log('Using OBJ loader for', url);
      return await loadOBJModel(url);
    } else if (lowerType === 'step' || lowerType === 'stp') {
      console.log('Using STP placeholder for', url);
      return await loadSTPModel(url);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Error loading model:', error);
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Return a default cube as fallback
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    return new THREE.Mesh(geometry, material);
  }
};

// We need to import toast for the STP loader
import { toast } from 'sonner';
