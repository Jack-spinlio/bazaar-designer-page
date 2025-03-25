
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Viewport } from '@/components/Viewport';
import { ComponentItem } from '@/components/Sidebar';

interface MainContentProps {
  selectedComponent: ComponentItem | null;
  onComponentPlaced: () => void;
  children?: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({
  selectedComponent,
  onComponentPlaced,
  children
}) => {
  const location = useLocation();
  const showComponentSidebar = location.pathname === '/components';
  const showPrefabSidebar = location.pathname === '/prefabs';
  const showSavedSidebar = location.pathname === '/saved';
  
  // Add check to prevent viewport on supplier pages, BOM and other pages
  const isSupplierRoute = location.pathname.startsWith('/supplier');
  const shouldRenderViewport = 
    !isSupplierRoute &&
    location.pathname !== '/bom' && 
    location.pathname !== '/timeline' &&
    location.pathname !== '/settings' &&
    location.pathname !== '/uploads';

  // Define the Shimano motor model from "My Uploads" as the default model
  const defaultShimanoModel: ComponentItem = {
    id: 'shimano-ep800-uploaded',
    name: 'Shimano Ep800',
    type: 'STL',
    thumbnail: '/placeholder.svg',
    folder: 'Uploads',
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models/1742796907092_Shimano_Ep800.stl',
    modelType: 'STL',
    shape: 'box' as const
  };

  console.log('MainContent - Current pathname:', location.pathname);
  console.log('MainContent - Default model:', defaultShimanoModel);
  console.log('MainContent - Selected component:', selectedComponent);

  return (
    <main className="flex-1 flex flex-col relative rounded-2xl overflow-hidden ml-2.5 bg-white shadow-sm">
      {shouldRenderViewport && (
        <Viewport 
          selectedComponent={selectedComponent || defaultShimanoModel} 
          onComponentPlaced={onComponentPlaced} 
        />
      )}
      {children && (!shouldRenderViewport || isSupplierRoute) && children}
    </main>
  );
};
