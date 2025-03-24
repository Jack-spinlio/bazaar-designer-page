
import React, { useState } from 'react';
import { IconSidebar } from './IconSidebar';
import { ComponentItem } from './Sidebar';
import { PrefabItem } from './PrefabSidebar';
import { SavedDesign } from './SavedSidebar';
import { Header } from './Header/Header';
import { SidebarContainer } from './Layout/SidebarContainer';
import { MainContent } from './Layout/MainContent';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string | null>("edit");
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [selectedPrefab, setSelectedPrefab] = useState<PrefabItem | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);

  const handleComponentSelected = (component: ComponentItem) => {
    setSelectedComponent(component);
    console.log('Component selected in Layout:', component.name);
  };

  const handlePrefabSelected = (prefab: PrefabItem) => {
    setSelectedPrefab(prefab);
    console.log('Prefab selected in Layout:', prefab.name);
  };

  const handleDesignSelected = (design: SavedDesign) => {
    setSelectedDesign(design);
    console.log('Design selected in Layout:', design.name);
  };

  const handleComponentPlaced = () => {
    console.log('Component placed in scene');
    setSelectedComponent(null);
    setSelectedPrefab(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F5F5F5] p-2.5">
      <Header />
      
      <div className="flex flex-1 overflow-hidden mt-2.5">
        <div className="flex h-full ml-0">
          <IconSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <SidebarContainer 
          activeTab={activeTab}
          onComponentSelected={handleComponentSelected}
          onPrefabSelected={handlePrefabSelected}
          onDesignSelected={handleDesignSelected}
        />

        <MainContent 
          selectedComponent={selectedComponent} 
          onComponentPlaced={handleComponentPlaced}
        >
          {children}
        </MainContent>
      </div>
    </div>
  );
};
