
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import EditToolbar from '@/components/EditToolbar';
import { Viewport } from '@/components/Viewport';
import { ComponentItem } from '@/components/Sidebar';

const Edit = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  
  const handleComponentPlaced = () => {
    setSelectedComponent(null);
  };

  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-[320px] p-2.5">
          <EditToolbar />
        </div>
        <div className="flex-1 p-2.5">
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
