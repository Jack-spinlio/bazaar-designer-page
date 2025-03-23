
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
