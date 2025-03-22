
import * as THREE from 'three';

export const createGridHelper = () => {
  const gridHelper = new THREE.GridHelper(10, 10);
  gridHelper.position.y = -0.01; // Slightly below the objects
  return gridHelper;
};

export const createDefaultCamera = () => {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);
  return camera;
};

export const createDefaultLighting = () => {
  const lights = [];
  
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  lights.push(ambientLight);
  
  // Directional light (sun-like)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  lights.push(directionalLight);
  
  return lights;
};

export const createMockHandlebar = () => {
  // Create a simple handlebar shape
  const group = new THREE.Group();
  
  // Main handlebar tube
  const barGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 32);
  const barMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888,
    metalness: 0.7,
    roughness: 0.2
  });
  barGeometry.rotateZ(Math.PI / 2);
  const bar = new THREE.Mesh(barGeometry, barMaterial);
  group.add(bar);
  
  // Left end
  const leftEndGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
  leftEndGeometry.rotateX(Math.PI / 6);
  const leftEnd = new THREE.Mesh(leftEndGeometry, barMaterial);
  leftEnd.position.set(-2, -0.4, 0);
  group.add(leftEnd);
  
  // Right end
  const rightEndGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
  rightEndGeometry.rotateX(-Math.PI / 6);
  const rightEnd = new THREE.Mesh(rightEndGeometry, barMaterial);
  rightEnd.position.set(2, -0.4, 0);
  group.add(rightEnd);
  
  // Center mount
  const centerGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
  const centerMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333,
    metalness: 0.8,
    roughness: 0.1
  });
  const center = new THREE.Mesh(centerGeometry, centerMaterial);
  center.position.set(0, -0.3, 0);
  group.add(center);
  
  return group;
};

export const createSnapPointIndicator = (position: THREE.Vector3, type: 'point' | 'plane' = 'point') => {
  const group = new THREE.Group();
  
  // Add visual indicator
  if (type === 'point') {
    // Sphere for point
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.7
    });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);
    
    // Rings around the sphere
    const ringGeometry = new THREE.RingGeometry(0.15, 0.17, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x0ea5e9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring2.rotation.y = Math.PI / 2;
    group.add(ring2);
  } else {
    // Circular plane for surface
    const geometry = new THREE.CircleGeometry(0.2, 32);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const circle = new THREE.Mesh(geometry, material);
    
    // Add normal vector line
    const normalLength = 0.3;
    const arrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      normalLength,
      0x0ea5e9,
      0.1,
      0.05
    );
    
    group.add(circle, arrowHelper);
  }
  
  group.position.copy(position);
  return group;
};
