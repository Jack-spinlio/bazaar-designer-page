
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Define the model types we support
export type ModelType = 'STL' | 'OBJ' | 'STP' | 'STEP' | 'GLB' | 'GLTF';

/**
 * Load a 3D model from a URL
 * @param url The URL of the model file
 * @param type The type of the model file
 * @returns A Promise that resolves to a THREE.Object3D
 */
export const loadModel = async (url: string, type: ModelType): Promise<THREE.Object3D> => {
  console.log(`Loading model from URL: ${url}, type: ${type}`);
  
  switch (type.toUpperCase()) {
    case 'STL':
      console.log(`Using STL loader for ${url}`);
      return loadSTLModel(url);
    case 'OBJ':
      console.log(`Using OBJ loader for ${url}`);
      return loadOBJModel(url);
    case 'GLB':
    case 'GLTF':
      console.log(`Using GLTF loader for ${url}`);
      return loadGLTFModel(url);
    case 'STP':
    case 'STEP':
      // STEP files can't be loaded directly in Three.js
      console.log(`STEP/STP format not directly supported: ${url}`);
      throw new Error('STEP/STP files are not directly supported in web browsers');
    default:
      console.log(`Unknown model type: ${type}, defaulting to STL loader`);
      return loadSTLModel(url);
  }
};

/**
 * Load an STL model
 * @param url The URL of the STL file
 * @returns A Promise that resolves to a THREE.Object3D
 */
const loadSTLModel = (url: string): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    console.log(`Starting to load STL model from URL: ${url}`);
    
    try {
      const loader = new STLLoader();
      
      loader.setRequestHeader({ 'Content-Type': 'application/octet-stream' });
      
      // Add a loading manager to track progress
      const manager = new THREE.LoadingManager();
      manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log(`Loading progress: ${itemsLoaded} / ${itemsTotal}`);
      };
      loader.manager = manager;
      
      loader.load(
        url,
        (geometry) => {
          console.log(`STL geometry loaded successfully from ${url}`);
          
          // Create a material and mesh from the geometry
          const material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.2,
            roughness: 0.8,
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          
          // Create a group to hold the mesh
          const group = new THREE.Group();
          group.add(mesh);
          
          console.log('STL model loaded and processed successfully');
          resolve(group);
        },
        (xhr) => {
          // Progress callback
          // console.log(`${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
        },
        (error) => {
          console.error('Error loading STL model:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          reject(new Error(`Failed to load STL model: ${errorMessage}`));
        }
      );
    } catch (error) {
      console.error('Error in STL loader setup:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Creating fallback shape for STL model: ${url}`);
      reject(new Error(`Error setting up STL loader: ${errorMessage}`));
    }
  });
};

/**
 * Load an OBJ model
 * @param url The URL of the OBJ file
 * @returns A Promise that resolves to a THREE.Object3D
 */
const loadOBJModel = (url: string): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    try {
      const loader = new OBJLoader();
      
      loader.load(
        url,
        (object) => {
          console.log('OBJ model loaded successfully');
          
          // Apply materials if needed
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x888888,
                metalness: 0.2,
                roughness: 0.8,
              });
            }
          });
          
          resolve(object);
        },
        (xhr) => {
          // Progress callback
          // console.log(`${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
        },
        (error) => {
          console.error('Error loading OBJ model:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          reject(new Error(`Failed to load OBJ model: ${errorMessage}`));
        }
      );
    } catch (error) {
      console.error('Error in OBJ loader setup:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reject(new Error(`Error setting up OBJ loader: ${errorMessage}`));
    }
  });
};

/**
 * Load a GLTF/GLB model
 * @param url The URL of the GLTF/GLB file
 * @returns A Promise that resolves to a THREE.Object3D
 */
const loadGLTFModel = (url: string): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    try {
      // Initialize the GLTF loader with DRACO support
      const loader = new GLTFLoader();
      
      // Set up DRACO loader for compressed meshes
      const dracoLoader = new DRACOLoader();
      // Set the path to the Draco decoder (using a CDN for now)
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      // Optional: Pre-fetch decoder to improve performance
      dracoLoader.preload();
      
      // Attach the DRACO loader to the GLTF loader
      loader.setDRACOLoader(dracoLoader);
      
      console.log('GLTF loader configured with DRACO support');
      
      loader.load(
        url,
        (gltf) => {
          console.log('GLTF/GLB model loaded successfully');
          
          // Ensure all materials are properly set up
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              // If the mesh has no material or uses a MeshBasicMaterial, replace it
              if (!child.material || child.material instanceof THREE.MeshBasicMaterial) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x888888,
                  metalness: 0.2,
                  roughness: 0.8,
                });
              }
            }
          });
          
          resolve(gltf.scene);
        },
        (xhr) => {
          // Progress callback
          console.log(`GLTF loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
        },
        (error) => {
          console.error('Error loading GLTF/GLB model:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          reject(new Error(`Failed to load GLTF/GLB model: ${errorMessage}`));
        }
      );
    } catch (error) {
      console.error('Error in GLTF loader setup:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reject(new Error(`Error setting up GLTF loader: ${errorMessage}`));
    }
  });
};
