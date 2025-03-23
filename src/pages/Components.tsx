
import React from 'react';
import { Layout } from '@/components/Layout';
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
      {/* Empty container - the Layout component already includes the Viewport */}
    </Layout>
  );
};

export default Components;
