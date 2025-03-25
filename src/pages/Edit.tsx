
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import EditToolbar from '@/components/EditToolbar';
import { Viewport } from '@/components/Viewport';
import { ComponentItem } from '@/components/Sidebar';
import { PrefabItem } from '@/components/PrefabSidebar';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

const Edit = () => {
  // Default Shimano motor model from "My Uploads"
  const defaultShimanoModel: ComponentItem = {
    id: 'shimano-ep800-uploaded',
    name: 'Shimano Ep800',
    type: 'STL',
    thumbnail: '/placeholder.svg',
    folder: 'Uploads',
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models/1742796907092_Shimano_Ep800.stl',
    modelType: 'STL',
    shape: 'box'
  };

  const location = useLocation();
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | PrefabItem | null>(defaultShimanoModel);
  
  // Check if there's a prefab passed from the Prefabs page
  useEffect(() => {
    if (location.state && location.state.selectedPrefab) {
      try {
        const prefab = location.state.selectedPrefab as PrefabItem;
        console.log('Received prefab from navigation:', prefab);
        
        // Ensure we have proper debugging for the prefab
        console.log(`Prefab model URL: ${prefab.modelUrl}`);
        console.log(`Prefab model type: ${prefab.modelType}`);
        
        // Create a properly typed component from the prefab
        const componentFromPrefab: ComponentItem = {
          id: prefab.id,
          name: prefab.name,
          type: prefab.modelType || 'GLTF',  // Default to GLTF if not specified
          thumbnail: prefab.thumbnail,
          folder: prefab.folder || 'Prefabs',
          modelUrl: prefab.modelUrl,
          modelType: prefab.modelType || 'GLTF', // Ensure model type is specified
          shape: prefab.shape
        };
        
        console.log('Setting component with processed prefab:', componentFromPrefab);
        setSelectedComponent(componentFromPrefab);
        toast.success(`Loaded prefab: ${componentFromPrefab.name}`);
      } catch (error) {
        console.error('Error processing prefab:', error);
        toast.error('Failed to load the prefab model');
      }
    }
  }, [location.state]);

  const handleComponentPlaced = () => {
    setSelectedComponent(defaultShimanoModel);
  };

  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-[320px] h-full">
          <EditToolbar />
        </div>
        <div className="flex-1 h-full">
          <Viewport 
            selectedComponent={selectedComponent}
            onComponentPlaced={handleComponentPlaced}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
