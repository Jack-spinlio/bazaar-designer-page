
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import EditToolbar from '@/components/EditToolbar';
import { Viewport } from '@/components/Viewport';
import { ComponentItem } from '@/components/Sidebar';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Edit = () => {
  // Default Shimano motor model
  const defaultShimanoModel: ComponentItem = {
    id: 'shimano-ep800',
    name: 'Shimano EP800',
    type: 'STL',
    thumbnail: '/placeholder.svg',
    folder: 'Default Models',
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//1742796907092_Shimano_Ep800.stl',
    shape: 'box' // Added the required shape property
  };

  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(defaultShimanoModel);
  
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
