
import React from 'react';
import { Layout } from '@/components/Layout';
import { Viewport } from '@/components/Viewport';
import { ComponentItem } from '@/components/Sidebar';

const Components = () => {
  const [selectedComponent, setSelectedComponent] = React.useState<ComponentItem | null>(null);
  
  const handleComponentSelect = (component: ComponentItem) => {
    setSelectedComponent(component);
  };
  
  const handleComponentPlaced = () => {
    setSelectedComponent(null);
  };
  
  return (
    <Layout>
      <div className="flex-1 h-full">
        <Viewport 
          selectedComponent={selectedComponent}
          onComponentPlaced={handleComponentPlaced}
        />
      </div>
    </Layout>
  );
};

export default Components;
