
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import EditToolbar from '@/components/EditToolbar';
import { Viewport } from '@/components/Viewport';
import { ComponentItem } from '@/components/Sidebar';
import { PrefabItem } from '@/components/PrefabSidebar';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

const Edit = () => {
  // Default Shimano motor model
  const defaultShimanoModel: ComponentItem = {
    id: 'shimano-ep800',
    name: 'Shimano EP800',
    type: 'STL',
    thumbnail: '/placeholder.svg',
    folder: 'Default Models',
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
        
        // Clone the prefab to avoid reference issues
        const prefabToUse = {...prefab};
        
        // Ensure we have modelType if it's not already specified
        if (prefabToUse.modelUrl && !prefabToUse.modelType) {
          const extension = prefabToUse.modelUrl.split('.').pop()?.toUpperCase();
          prefabToUse.modelType = extension;
          console.log(`Inferred model type from URL extension: ${extension}`);
        }
        
        // For CompleteBike.gltf, ensure we're using GLTF type
        if (prefabToUse.modelUrl && prefabToUse.modelUrl.includes('CompleteBike.gltf')) {
          prefabToUse.modelType = 'GLTF';
          console.log('Setting explicit GLTF type for CompleteBike model');
        }
        
        // Set the component with processed data
        setSelectedComponent(prefabToUse);
        console.log('Setting component with prefab:', prefabToUse);
        toast.success(`Loaded prefab: ${prefabToUse.name}`);
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
