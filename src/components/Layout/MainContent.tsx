
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

  // Define the default component for the design page
  const defaultShimanoModel: ComponentItem | null = location.pathname === '/design' ? {
    id: 'bike-15',
    name: "Men's Urban eBike",
    type: 'GLTF',
    thumbnail: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models/Modmo.jpg.pdf',
    folder: 'Bikes',
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models/CompleteBike.gltf',
    modelType: 'GLTF',
    shape: 'box'
  } : null;

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
