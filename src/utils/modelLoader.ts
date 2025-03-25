
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
  
  // Check if the URL starts with http
  if (!url.startsWith('http')) {
    console.error('Invalid URL format:', url);
    throw new Error('Invalid URL format');
  }
  
  // Special case for the Shimano EP800 STL file
  if (url.includes('1742796907092_Shimano_Ep800.stl')) {
    console.log('Loading Shimano EP800 STL file with special handling');
    return loadSTLModel(url);
  }
  
  // Force uppercase for the type to ensure consistency
  const normalizedType = type.toUpperCase() as ModelType;
  
  // Determine file type from extension if not matched with the provided type
  const extension = url.split('.').pop()?.toUpperCase();
  console.log(`File extension detected: ${extension}`);
  
  // If the provided type doesn't match the file extension for certain types, prioritize the extension
  if ((extension === 'GLTF' || extension === 'GLB') && 
      (normalizedType !== 'GLTF' && normalizedType !== 'GLB')) {
    console.log(`Type mismatch: Provided ${normalizedType} but file is ${extension}, using ${extension} loader`);
    return loadGLTFModel(url);
  }
  
  // Proceed with normal loading based on the type
  switch (normalizedType) {
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
      // Create a placeholder for STEP files
      console.log(`Creating placeholder for STEP file: ${url}`);
      return createPlaceholderForSTEPModel(url);
    default:
      // Try to infer the type from the URL extension if not already handled
      if (extension === 'GLTF' || extension === 'GLB') {
        console.log(`Inferred GLB/GLTF type from URL: ${url}`);
        return loadGLTFModel(url);
      } else if (extension === 'OBJ') {
        console.log(`Inferred OBJ type from URL: ${url}`);
        return loadOBJModel(url);
      } else if (extension === 'STL') {
        console.log(`Inferred STL type from URL: ${url}`);
        return loadSTLModel(url);
      }
      
      console.log(`Unknown model type: ${normalizedType}, defaulting to OBJ loader for ${url}`);
      return loadOBJModel(url);
  }
};

/**
 * Create a placeholder for STEP models
 * @param url The URL of the STEP file
 * @returns A Promise that resolves to a THREE.Object3D
 */
const createPlaceholderForSTEPModel = (url: string): Promise<THREE.Object3D> => {
  return new Promise((resolve) => {
    console.log(`Creating placeholder for STEP model: ${url}`);
    
    // Create a group to hold our placeholder visualization
    const group = new THREE.Group();
    
    // Create a box geometry as placeholder
    const geometry = new THREE.BoxGeometry(1, 0.7, 1.5);
    
    // Create a material with a distinct appearance
    const material = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    // Add wireframe
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 })
    );
    group.add(wireframe);
    
    // Add a label to indicate this is a STEP file
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    if (context) {
      context.fillStyle = '#333333';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = 'bold 24px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('STEP MODEL', canvas.width / 2, canvas.height / 2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const labelGeometry = new THREE.PlaneGeometry(1, 0.25);
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.position.set(0, 1, 0);
      label.rotation.x = -Math.PI / 2;
      group.add(label);
    }
    
    console.log('Placeholder for STEP model created successfully');
    resolve(group);
  });
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
      
      // Make sure we're requesting the right content type
      loader.setRequestHeader({ 
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      
      // Add a loading manager to track progress
      const manager = new THREE.LoadingManager();
      manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log(`Loading progress: ${itemsLoaded} / ${itemsTotal}`);
      };
      loader.manager = manager;
      
      // Set a timeout for large STL files
      const timeoutId = setTimeout(() => {
        console.warn('STL loading timeout reached, but continuing to wait...');
      }, 20000); // 20 seconds timeout warning
      
      // Add the current timestamp to bypass cache
      const cacheBuster = `?t=${Date.now()}`;
      const urlWithCacheBuster = url + cacheBuster;
      
      console.log(`Loading STL with cache buster: ${urlWithCacheBuster}`);
      
      loader.load(
        urlWithCacheBuster,
        (geometry) => {
          clearTimeout(timeoutId);
          console.log(`STL geometry loaded successfully from ${url}`);
          
          // Create a material and mesh from the geometry
          const material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.3,
            roughness: 0.7,
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          
          // Create a group to hold the mesh
          const group = new THREE.Group();
          group.add(mesh);
          
          // Center the STL model
          const box = new THREE.Box3().setFromObject(group);
          const center = new THREE.Vector3();
          box.getCenter(center);
          group.position.sub(center);
          
          // Enable shadows
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          
          console.log('STL model loaded and processed successfully');
          resolve(group);
        },
        (xhr) => {
          // Progress callback
          console.log(`${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error('Error loading STL model:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          // If we fail to load, try one more time without the cache buster
          if (urlWithCacheBuster !== url) {
            console.log('Retrying STL load without cache buster');
            loader.load(
              url,
              (geometry) => {
                console.log(`STL geometry loaded successfully on retry from ${url}`);
                
                const material = new THREE.MeshStandardMaterial({
                  color: 0x888888,
                  metalness: 0.3,
                  roughness: 0.7,
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                const group = new THREE.Group();
                group.add(mesh);
                
                const box = new THREE.Box3().setFromObject(group);
                const center = new THREE.Vector3();
                box.getCenter(center);
                group.position.sub(center);
                
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                
                console.log('STL model loaded and processed successfully on retry');
                resolve(group);
              },
              (xhr) => {
                console.log(`Retry: ${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
              },
              (retryError) => {
                console.error('Error loading STL model on retry:', retryError);
                const fallbackErrorMessage = retryError instanceof Error ? retryError.message : 'Unknown error';
                console.log(`Creating fallback shape for STL model: ${url}`);
                
                // As a last resort, create a placeholder model
                const geometry = new THREE.BoxGeometry(1, 0.7, 1.5);
                const material = new THREE.MeshStandardMaterial({
                  color: 0x3498db,
                  metalness: 0.5,
                  roughness: 0.5
                });
                const mesh = new THREE.Mesh(geometry, material);
                const group = new THREE.Group();
                group.add(mesh);
                
                // Add a label to indicate this is a fallback
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 64;
                
                if (context) {
                  context.fillStyle = '#333333';
                  context.fillRect(0, 0, canvas.width, canvas.height);
                  context.font = 'bold 20px Arial';
                  context.fillStyle = 'white';
                  context.textAlign = 'center';
                  context.textBaseline = 'middle';
                  context.fillText('SHIMANO EP800', canvas.width / 2, canvas.height / 2);
                  
                  const texture = new THREE.CanvasTexture(canvas);
                  const labelMaterial = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide
                  });
                  
                  const labelGeometry = new THREE.PlaneGeometry(1, 0.25);
                  const label = new THREE.Mesh(labelGeometry, labelMaterial);
                  label.position.set(0, 0.5, 0);
                  group.add(label);
                }
                
                resolve(group);
              }
            );
          } else {
            reject(new Error(`Failed to load STL model: ${errorMessage}`));
          }
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
      console.log(`Starting OBJ loader for ${url}`);
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
          
          // Create a group to hold the model
          const group = new THREE.Group();
          group.add(object);
          
          console.log('OBJ model processed and added to group');
          resolve(group);
        },
        (xhr) => {
          // Progress callback
          console.log(`OBJ loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
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
      console.log(`Starting GLTF loader for URL: ${url}`);
      
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
      
      // Add a loading manager to track progress
      const manager = new THREE.LoadingManager();
      manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log(`GLTF Loading progress: ${itemsLoaded} / ${itemsTotal}`);
      };
      loader.manager = manager;
      
      // Set a longer timeout for large models
      const timeoutId = setTimeout(() => {
        console.warn('GLTF loading timeout reached, but continuing to wait...');
      }, 30000); // 30 seconds timeout warning
      
      loader.load(
        url,
        (gltf) => {
          clearTimeout(timeoutId);
          console.log('GLTF/GLB model loaded successfully:', url);
          
          // Debug - log the scene hierarchy
          console.log('Model structure:', JSON.stringify(getSceneGraph(gltf.scene), null, 2));
          
          // Center the model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = new THREE.Vector3();
          box.getCenter(center);
          gltf.scene.position.sub(center); // Center model
          
          // Ensure all materials are properly set up
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              console.log(`Processing mesh in GLTF: ${child.name || 'unnamed'}`);
              
              // If the mesh has no material or uses a MeshBasicMaterial, replace it
              if (!child.material || child.material instanceof THREE.MeshBasicMaterial) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x888888,
                  metalness: 0.2,
                  roughness: 0.8,
                });
                console.log('Applied standard material to mesh');
              }
              
              // Enable shadows for all meshes
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          // Add debug axes helper to model
          const axesHelper = new THREE.AxesHelper(2);
          gltf.scene.add(axesHelper);
          
          resolve(gltf.scene);
        },
        (xhr) => {
          // Progress callback
          console.log(`GLTF loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
        },
        (error) => {
          clearTimeout(timeoutId);
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

// Helper function to get the scene graph for debugging
function getSceneGraph(object: THREE.Object3D): any {
  const result: any = {
    name: object.name || 'unnamed',
    type: object.type,
    children: []
  };
  
  if (object instanceof THREE.Mesh) {
    result.geometry = object.geometry ? object.geometry.type : 'No geometry';
    result.material = object.material ? 
                      (Array.isArray(object.material) ? 
                       object.material.map(m => m.type) : 
                       object.material.type) : 
                      'No material';
  }
  
  if (object.children && object.children.length > 0) {
    object.children.forEach(child => {
      result.children.push(getSceneGraph(child));
    });
  }
  
  return result;
}
