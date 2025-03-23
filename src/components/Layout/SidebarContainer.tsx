
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar, ComponentItem } from '@/components/Sidebar';
import { PrefabSidebar, PrefabItem } from '@/components/PrefabSidebar';
import { SavedSidebar, SavedDesign } from '@/components/SavedSidebar';

interface SidebarContainerProps {
  onComponentSelected: (component: ComponentItem) => void;
  onPrefabSelected: (prefab: PrefabItem) => void;
  onDesignSelected: (design: SavedDesign) => void;
}

export const SidebarContainer: React.FC<SidebarContainerProps> = ({
  onComponentSelected,
  onPrefabSelected,
  onDesignSelected
}) => {
  const location = useLocation();
  const showComponentSidebar = location.pathname === '/components';
  const showPrefabSidebar = location.pathname === '/prefabs';
  const showSavedSidebar = location.pathname === '/saved';

  return (
    <>
      {showComponentSidebar && (
        <div className="w-80 transition-all duration-300 ease-in-out ml-2.5">
          <Sidebar onSelectComponent={onComponentSelected} />
        </div>
      )}

      {showPrefabSidebar && (
        <div className="w-80 transition-all duration-300 ease-in-out ml-2.5">
          <PrefabSidebar onSelectPrefab={onPrefabSelected} />
        </div>
      )}

      {showSavedSidebar && (
        <div className="w-80 transition-all duration-300 ease-in-out ml-2.5">
          <SavedSidebar onSelectDesign={onDesignSelected} />
        </div>
      )}
    </>
  );
};
