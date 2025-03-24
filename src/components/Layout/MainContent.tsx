
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
  
  // Add check to prevent viewport on BOM and other pages where it's not needed
  const shouldRenderViewport = location.pathname !== '/bom' && 
                              location.pathname !== '/timeline' &&
                              location.pathname !== '/settings' &&
                              location.pathname !== '/uploads';

  return (
    <main className="flex-1 flex flex-col relative rounded-2xl overflow-hidden ml-2.5 bg-white shadow-sm">
      {shouldRenderViewport && (
        <Viewport selectedComponent={selectedComponent} onComponentPlaced={onComponentPlaced} />
      )}
      {/* Only render children if they exist and we're not showing the viewport */}
      {children && !shouldRenderViewport && children}
    </main>
  );
};
