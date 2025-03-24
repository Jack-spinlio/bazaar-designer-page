import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { toast } from 'sonner';

// Load an STL file from a URL and return a mesh
export const loadSTLModel = (
  url: string, 
  onLoad?: (mesh: THREE.Mesh) => void,
  onProgress?: (event: ProgressEvent) => void,
  onError?: (error: unknown) => void
): Promise<THREE.Mesh> => {
  return new Promise((resolve, reject) => {
    console.log(`Starting to load STL model from URL: ${url}`);
    
    // Create a fallback mesh in case loading fails
    const fallbackMesh = createFallbackMesh('STL', url);
    
    try {
      const loader = new STLLoader();
      
      loader.load(
        url,
        (geometry) => {
          console.log(`STL geometry loaded successfully from ${url}`);
          
          try {
            // Check if the geometry is valid
            if (!geometry || !geometry.attributes || !geometry.attributes.position) {
              console.warn('Loaded STL geometry appears to be invalid');
              if (onError) onError(new Error('Invalid STL geometry'));
              resolve(fallbackMesh);
              return;
            }
            
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
          } catch (processingError) {
            console.error('Error processing STL geometry:', processingError);
            if (onError) onError(processingError);
            resolve(fallbackMesh);
          }
        },
        (progressEvent) => {
          console.log(`Loading progress: ${progressEvent.loaded} / ${progressEvent.total}`);
          if (onProgress) onProgress(progressEvent);
        },
        (error) => {
          console.error('Error loading STL:', error);
          toast.error(`Error loading STL model: ${error.message || 'Unknown error'}`);
          if (onError) onError(error);
          resolve(fallbackMesh);
        }
      );
    } catch (initError) {
      console.error('Error initializing STL loader:', initError);
      if (onError) onError(initError);
      resolve(fallbackMesh);
    }
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
    
    // Create a fallback mesh in case loading fails
    const fallbackMesh = createFallbackGroup('OBJ', url);
    
    try {
      const loader = new OBJLoader();
      
      loader.load(
        url,
        (object) => {
          console.log(`OBJ model loaded successfully from ${url}`);
          try {
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
          } catch (processingError) {
            console.error('Error processing OBJ model:', processingError);
            if (onError) onError(processingError);
            resolve(fallbackMesh);
          }
        },
        (progressEvent) => {
          console.log(`Loading progress: ${progressEvent.loaded} / ${progressEvent.total}`);
          if (onProgress) onProgress(progressEvent);
        },
        (error) => {
          console.error('Error loading OBJ:', error);
          toast.error(`Error loading OBJ model: ${error.message || 'Unknown error'}`);
          if (onError) onError(error);
          resolve(fallbackMesh);
        }
      );
    } catch (initError) {
      console.error('Error initializing OBJ loader:', initError);
      if (onError) onError(initError);
      resolve(fallbackMesh);
    }
  });
};

// Load a GLB/GLTF file from a URL
export const loadGLTFModel = (
  url: string,
  onLoad?: (model: THREE.Group) => void,
  onProgress?: (event: ProgressEvent) => void,
  onError?: (error: unknown) => void
): Promise<THREE.Group> => {
  return new Promise((resolve, reject) => {
    console.log(`Starting to load GLTF/GLB model from URL: ${url}`);
    
    // Create a fallback mesh in case loading fails
    const fallbackMesh = createFallbackGroup('GLTF', url);
    
    try {
      const loader = new GLTFLoader();
      
      loader.load(
        url,
        (gltf) => {
          console.log(`GLTF/GLB model loaded successfully from ${url}`);
          try {
            const model = gltf.scene;
            
            // Apply materials to all meshes
            model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                // Keep original materials for GLTF/GLB as they often have textures
                if (!child.material) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: 0x22c55e,
                    metalness: 0.3,
                    roughness: 0.4
                  });
                }
              }
            });
            
            if (onLoad) onLoad(model);
            resolve(model);
            console.log('GLTF/GLB model processed successfully');
          } catch (processingError) {
            console.error('Error processing GLTF/GLB model:', processingError);
            if (onError) onError(processingError);
            resolve(fallbackMesh);
          }
        },
        (progressEvent) => {
          console.log(`Loading progress: ${progressEvent.loaded} / ${progressEvent.total}`);
          if (onProgress) onProgress(progressEvent);
        },
        (error) => {
          console.error('Error loading GLTF/GLB:', error);
          toast.error(`Error loading GLTF/GLB model: ${error.message || 'Unknown error'}`);
          if (onError) onError(error);
          resolve(fallbackMesh);
        }
      );
    } catch (initError) {
      console.error('Error initializing GLTF/GLB loader:', initError);
      if (onError) onError(initError);
      resolve(fallbackMesh);
    }
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
    
    toast.info(`STP/STEP file format can only be displayed as a placeholder`);
    
    resolve(group);
  });
};

// Helper function to create fallback mesh for STL loading errors
const createFallbackMesh = (fileType: string, url: string): THREE.Mesh => {
  console.log(`Creating fallback shape for ${fileType} model: ${url}`);
  
  // Create a pyramid instead of a cube to distinguish fallbacks from STP placeholders
  const geometry = new THREE.ConeGeometry(0.4, 0.8, 4);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xff3333,  // Red color to indicate error
    metalness: 0.2,
    roughness: 0.8
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  
  toast.error(`Failed to load ${fileType} model from ${url}`);
  
  return mesh;
};

// Helper function to create fallback group for OBJ loading errors
const createFallbackGroup = (fileType: string, url: string): THREE.Group => {
  console.log(`Creating fallback shape for ${fileType} model: ${url}`);
  
  const group = new THREE.Group();
  
  // Create a pyramid instead of a cube to distinguish fallbacks
  const geometry = new THREE.ConeGeometry(0.4, 0.8, 4);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xff3333,  // Red color to indicate error
    metalness: 0.2,
    roughness: 0.8
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);
  
  toast.error(`Failed to load ${fileType} model from ${url}`);
  
  return group;
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
    } else if (lowerType === 'glb' || lowerType === 'gltf') {
      console.log('Using GLTF loader for', url);
      return await loadGLTFModel(url);
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
    
    // Return a default cube as fallback with red color
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xff3333,
      wireframe: true
    });
    
    toast.error(`Failed to load 3D model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    return new THREE.Mesh(geometry, material);
  }
};
