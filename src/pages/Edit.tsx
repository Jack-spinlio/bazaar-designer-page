
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
    shape: 'box' // Added the required shape property
  };

  const location = useLocation();
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | PrefabItem | null>(defaultShimanoModel);
  
  // Check if there's a prefab passed from the Prefabs page
  useEffect(() => {
    if (location.state && location.state.selectedPrefab) {
      const prefab = location.state.selectedPrefab as PrefabItem;
      console.log('Received prefab from navigation:', prefab);
      setSelectedComponent(prefab);
      toast.success(`Loaded prefab: ${prefab.name}`);
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
